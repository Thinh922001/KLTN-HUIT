import { Injectable } from '@nestjs/common';
import {
  CouponRepository,
  InvoiceRepository,
  OrderDetailRepository,
  OrderRepository,
  ProductDetailsRepository,
  ReturnOrderRepository,
} from '../../repositories';
import { OrderDto } from './dto/order.dto';
import {
  CartEntity,
  CartItemEntity,
  CouponEntity,
  InvoiceEntity,
  OrderDetailEntity,
  OrderEntity,
  OrderStatusHistory,
  ProductDetailsEntity,
  ProductsEntity,
  UserEntity,
} from '../../entities';
import { Transactional } from 'typeorm-transactional';
import { CartService } from '../cart/cart.service';
import { BadRequestException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { CouponService } from '../coupon/coupon.service';
import { OrderReturnStatus, OrderStatus, ShippingMethod } from '../../types';
import { GetOrder, OrderUser } from './dto/get-order.dto';
import { applyPagination, convertHttpToHttps, getTableName } from '../../utils/utils';
import { GetOrderAd } from './dto/get-order-admin';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { OrderStatusHistoryRepository } from '../../repositories/order-status-history.repository';
import { MailService } from '../mail/mail.service';
import { AdminRepository } from '../../repositories/admin.repository';
import { PayMentDto } from './dto/payment.dto';
import { WalletsRepository } from '../../repositories/wallets.repository';
import { WalletsEntity } from '../../entities/wallets.entity';
import { CancelOrderDto } from './dto/cancel-order.dto';

@Injectable()
export class OrderService {
  productDetailAlias: string;
  productAlias: string;
  userAlias: string;
  cartItemAlias: string;
  couponAlias: string;
  orderAlias: string;
  orderDetailAlias: string;
  walletAlias: string;
  invoiceAlias: string;
  constructor(
    private readonly cartService: CartService,
    private readonly couponService: CouponService,
    private readonly mailService: MailService,
    private readonly orderRepo: OrderRepository,
    private readonly productDetailRepo: ProductDetailsRepository,
    private readonly couponRepo: CouponRepository,
    private readonly invoiceRepo: InvoiceRepository,
    private readonly orderHistoryRepo: OrderStatusHistoryRepository,
    private readonly adminRepo: AdminRepository,
    private readonly walletRepo: WalletsRepository,
    private readonly returnOrderRepo: ReturnOrderRepository
  ) {
    this.productDetailAlias = getTableName(ProductDetailsEntity);
    this.productAlias = getTableName(ProductsEntity);
    this.userAlias = UserEntity.name;
    this.cartItemAlias = CartItemEntity.name;
    this.couponAlias = CouponEntity.name;
    this.orderAlias = getTableName(OrderEntity);
    this.orderDetailAlias = getTableName(OrderDetailEntity);
    this.walletAlias = WalletsEntity.name;
    this.invoiceAlias = InvoiceEntity.name;
  }

  public async getOrder(user: UserEntity, { filterBy, take = 3, skip }: GetOrder) {
    const query = this.orderRepo
      .createQueryBuilder(this.orderAlias)
      .withDeleted()
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
      .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.productDetailAlias}.product`, this.productAlias)
      .where(`${this.orderAlias}.customer_id = :userId`, { userId: user.id })
      .orderBy(`${this.orderAlias}.createdAt`, 'DESC')
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.status`,
        `${this.orderAlias}.total_amount`,
        `${this.orderAlias}.createdAt`,
        `${this.orderDetailAlias}.id`,
        `${this.productDetailAlias}.id`,
        `${this.productDetailAlias}.variationDetails`,
        `${this.productAlias}.id`,
        `${this.productAlias}.img`,
        `${this.productAlias}.productName`,
      ]);

    if (filterBy) {
      query.andWhere(`${this.orderAlias}.status =:status`, { status: filterBy });
    }

    const { data, paging } = await applyPagination<OrderEntity>(query, take, skip);

    const result: OrderUser[] = data.map((e) => new OrderUser(e));
    return {
      data: result,
      paging,
    };
  }

  public async getAllOrder({ filterBy, take, skip }: GetOrder) {
    const query = this.orderRepo
      .createQueryBuilder(this.orderAlias)
      .withDeleted()
      .leftJoin(`${this.orderAlias}.customer`, this.userAlias)
      .orderBy(`${this.orderAlias}.createdAt`, 'DESC')
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.status`,
        `${this.orderAlias}.total_amount`,
        `${this.orderAlias}.shipping_address`,
        `${this.orderAlias}.createdAt`,
        `${this.orderAlias}.note`,
        `${this.userAlias}.id`,
        `${this.userAlias}.phone`,
      ]);

    if (filterBy) {
      console.log('Vo');
      query.andWhere(`${this.orderAlias}.status =:status`, { status: filterBy });
    }

    const { data, paging } = await applyPagination<OrderEntity>(query, take, skip);

    return {
      data: data,
      paging,
    };
  }

  @Transactional()
  async createOrder(user: UserEntity, { carts, auth, coupon, note, address }: OrderDto) {
    const cartMap = new Map(carts.map((e) => [e.id, e]));
    const productDetailRepo = this.orderRepo.manager.getRepository(ProductDetailsEntity);
    const userRepo = this.orderRepo.manager.getRepository(UserEntity);
    const orderDetailRepo = this.orderRepo.manager.getRepository(OrderDetailEntity);
    const statusOrderHistoryRepo = this.orderRepo.manager.getRepository(OrderStatusHistory);
    const cartRepo = this.orderRepo.manager.getRepository(CartEntity);
    const cartItemsRepo = this.orderRepo.manager.getRepository(CartItemEntity);
    const couponRepo = this.orderRepo.manager.getRepository(CouponEntity);

    let orderCustomer = user;

    if (!orderCustomer) {
      orderCustomer = await userRepo.findOne({ where: { phone: auth.phone }, select: ['id', 'name', 'phone'] });
      if (!orderCustomer) {
        const userEntity = userRepo.create({
          phone: auth.phone,
          name: auth.fullName,
          gender: auth.gender,
          address: address,
        });
        orderCustomer = await userRepo.save(userEntity);
      }
    } else {
      orderCustomer = await userRepo.findOne({ where: { id: user.id }, select: ['id', 'name', 'phone'] });
    }

    const productDetail = await productDetailRepo
      .createQueryBuilder(this.productDetailAlias)
      .leftJoin(`${this.productDetailAlias}.product`, this.productAlias)
      .where(`${this.productDetailAlias}.id IN(:...ids)`, { ids: carts.map((e) => e.id) })
      .select([
        `${this.productDetailAlias}.id`,
        `${this.productDetailAlias}.price`,
        `${this.productDetailAlias}.stock`,
        `${this.productDetailAlias}.variationDetails`,
        `${this.productAlias}.id`,
        `${this.productAlias}.productName`,
        `${this.productAlias}.img`,
      ])
      .getMany();

    if (!productDetail.length || productDetail.length !== carts.length) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    if (productDetail.some((e) => e.stock < cartMap.get(e.id).quantity)) {
      throw new BadRequestException(ErrorMessage.SOLD_OUT);
    }

    let totalAmount = productDetail.reduce<number>((acc, item) => acc + +item.price * cartMap.get(item.id).quantity, 0);

    const couponData = coupon ? await this.couponService.checkCoupon({ code: coupon, totalAmount }) : null;
    totalAmount = couponData ? couponData.totalAmount : totalAmount;

    const updateProductDetail = productDetail.map((e) => ({
      ...e,
      stock: e.stock - cartMap.get(e.id).quantity,
    }));

    const newOrder = this.orderRepo.create({
      status: OrderStatus.Pending,
      total_amount: totalAmount,
      shipping_method: ShippingMethod.STANDARD,
      shipping_address: address,
      note: note,
      customer: orderCustomer,
      coupon: couponData ? { id: couponData.id } : null,
    });
    const savedOrder = await this.orderRepo.save(newOrder);

    const orderDetail = productDetail.map((e) => {
      const cart = cartMap.get(e.id);
      return orderDetailRepo.create({
        unit_price: e.price,
        quantity: cart.quantity,
        total_price: +e.price * cart.quantity,
        order: { id: savedOrder.id },
        sku: { id: e.id },
      });
    });

    const statusOrderHistory = statusOrderHistoryRepo.create({
      status: OrderStatus.Pending,
      order: { id: savedOrder.id },
    });

    await Promise.all([
      productDetailRepo.save(updateProductDetail),
      orderDetailRepo.save(orderDetail),
      statusOrderHistoryRepo.save(statusOrderHistory),
    ]);

    if (couponData) {
      await couponRepo
        .createQueryBuilder()
        .update()
        .set({ times_used: () => `times_used + 1` })
        .where('id = :couponId', { couponId: couponData.id })
        .execute();
    }

    const cartIds = await cartRepo
      .createQueryBuilder('cart')
      .select('cart.id')
      .where('cart.customer_id = :customerId', { customerId: orderCustomer.id })
      .getMany();

    if (cartIds.length > 0) {
      const cartIdList = cartIds.map((cart) => cart.id);

      await cartItemsRepo.createQueryBuilder().delete().where('cart_id IN (:...cartIdList)', { cartIdList }).execute();
    }

    await cartRepo
      .createQueryBuilder()
      .delete()
      .where('customer_id = :customerId', { customerId: orderCustomer.id })
      .execute();

    const adminEmails = await this.adminRepo.find({ where: { roleName: 'SUPPER_ADMIN' } });

    if (adminEmails.length) {
      const emailList = adminEmails.map((e) => e.email);
      const totalPrice = productDetail.reduce<number>((acc, item) => {
        const cartItem = cartMap.get(item.id);
        return cartItem ? acc + +item.price * cartItem.quantity : acc;
      }, 0);

      await this.mailService.sendOrderEmail({
        adminEmails: emailList,
        userName: orderCustomer.name,
        phone: orderCustomer.phone,
        totalPrice,
        discountCode: coupon,
        discountAmount: Number(totalPrice) - (couponData ? Number(couponData.totalAmount) : 0),
        finalTotal: totalAmount,
        orderId: `#${savedOrder.id}`,
        products: productDetail.map((e) => {
          return {
            image: convertHttpToHttps(e.product.img),
            name:
              e.product.productName +
              (e.variationDetails && e.variationDetails['color'] ? ` ${String(e.variationDetails['color'])}` : ''),
            price: Number(e.price),
            quantity: cartMap.get(e.id).quantity,
          };
        }),
      });
    }

    return savedOrder;
  }

  async getOrderAd({ status, take, skip }: GetOrderAd) {
    const query = this.orderRepo
      .createQueryBuilder(this.orderAlias)
      .leftJoin(`${this.orderAlias}.customer`, this.userAlias)
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.status`,
        `${this.orderAlias}.total_amount`,
        `${this.orderAlias}.shipping_address`,
        `${this.userAlias}.id`,
        `${this.userAlias}.name`,
      ]);

    if (status) {
      query.andWhere(`${this.orderAlias}.status =:status`, { status });
    }

    const { data, paging } = await applyPagination<OrderEntity>(query, take, skip);

    return {
      data: data,
      paging: paging,
    };
  }

  async getOrderByUserId(userId: number) {
    return await this.orderRepo
      .createQueryBuilder(this.orderAlias)
      .withDeleted()
      .where(`${this.orderAlias}.customer_id =:userId`, { userId })
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.status`,
        `${this.orderAlias}.total_amount`,
        `${this.orderAlias}.shipping_address`,
      ])
      .getMany();
  }

  async updateOrCreateWallet(userId: number, amount: number) {
    let wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!wallet) {
      wallet = this.walletRepo.create({
        user: { id: userId } as UserEntity,
        balance: amount,
      });
    } else {
      wallet.balance = amount;
    }

    await this.walletRepo.save(wallet);
  }

  @Transactional()
  async updateOrderStatus({ status, orderId }: UpdateOrderStatus) {
    const order = await this.orderRepo
      .createQueryBuilder(this.orderAlias)
      .where(`${this.orderAlias}.id =:orderId`, { orderId })
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
      .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.orderAlias}.coupon`, this.couponAlias)
      .leftJoin(`${this.orderAlias}.invoices`, this.invoiceAlias)
      .leftJoin(`${this.orderAlias}.customer`, this.userAlias)
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.status`,
        `${this.orderAlias}.total_amount`,
        `${this.couponAlias}.id`,
        `${this.userAlias}.id`,
        `${this.orderDetailAlias}.id`,
        `${this.orderDetailAlias}.quantity`,
        `${this.productDetailAlias}.id`,
        `${this.invoiceAlias}.id`,
        `${this.invoiceAlias}.total_amount`,
        `${this.invoiceAlias}.status`,
      ])
      .getOne();

    if (!order) {
      throw new BadRequestException(ErrorMessage.ORDER_NOT_FOUND);
    }

    if (order.status === status) {
      throw new BadRequestException(ErrorMessage.ORDER_STATUS_NOT_CHANGE);
    }

    if (order.status == OrderStatus.Canceled && order.invoices.some((e) => e.status === 'PAID')) {
      throw new BadRequestException(ErrorMessage.ORDER_STATUS_NOT_CHANGE);
    }

    // refund stock, coupon
    // if user paid cannot cancel
    if (status === OrderStatus.Canceled) {
      if (order.orderDetails?.length) {
        const updateOderDetailStock = order.orderDetails.map((e) =>
          this.productDetailRepo.update(e.sku.id, {
            stock: () => `stock + ${e.quantity}`,
          })
        );

        if (order.coupon) {
          const updateCoupon = this.couponRepo.update(order.coupon.id, {
            times_used: () => `times_used - 1`,
          });
          await Promise.all([...updateOderDetailStock, updateCoupon]);
        } else {
          await Promise.all(updateOderDetailStock);
        }
      }
    }

    // create new invoice if not exist
    if (status === OrderStatus.Completed) {
      // check not existed
      if (!order.invoices[0]) {
        await this.invoiceRepo.save(
          this.invoiceRepo.create({
            total_amount: order.total_amount,
            status: 'Unpaid',
            payment_method: '',
            order: { id: order.id },
            customer: { id: order.customer.id },
          })
        );
      }
    }

    // refund stock, coupon, balance for user
    if (status === OrderStatus.Returned) {
      if (order.invoices.some((e) => e.status === 'PAID')) {
        await this.updateOrCreateWallet(order.customer.id, order.total_amount);
        const paidInvoice = order.invoices.find((e) => e.status === 'PAID');
        await this.invoiceRepo.save(
          this.invoiceRepo.create({
            order: { id: orderId },
            status: 'RETURN',
            total_amount: order.total_amount,
            customer: { id: order.customer.id },
          })
        );
        await this.invoiceRepo.update(paidInvoice.id, {
          total_amount: 0,
        });

        if (order.orderDetails?.length) {
          const updateOderDetailStock = order.orderDetails.map((e) =>
            this.productDetailRepo.update(e.sku.id, {
              stock: () => `stock + ${e.quantity}`,
            })
          );

          if (order.coupon) {
            const updateCoupon = this.couponRepo.update(order.coupon.id, {
              times_used: () => `times_used - 1`,
            });
            await Promise.all([...updateOderDetailStock, updateCoupon]);
          } else {
            await Promise.all(updateOderDetailStock);
          }
        }
        // create return order
        if (order.orderDetails.length) {
          const returnsOrder = order.orderDetails.map((e) =>
            this.returnOrderRepo.create({
              status: OrderReturnStatus.Resolved,
              isApprove: true,
              reason: 'Admin return',
              quantity: e.quantity,
              order: { id: order.id },
              producDetail: { id: e.id },
              user: { id: order.customer.id },
            })
          );
          await this.returnOrderRepo.save(returnsOrder);
        }
      }
    }

    const saveOrderHistory = this.orderHistoryRepo.save(
      this.orderHistoryRepo.create({ status: status, order: { id: orderId } })
    );
    const updateOrder = this.orderRepo.update(orderId, { status: status });

    await Promise.all([saveOrderHistory, updateOrder]);

    return [];
  }

  @Transactional()
  async payment(user: UserEntity, { orderId, method }: PayMentDto) {
    const [order, userWallet] = await Promise.all([
      this.orderRepo
        .createQueryBuilder(this.orderAlias)
        .where(`${this.orderAlias}.id =:orderId`, {
          orderId,
        })
        .select([`${this.orderAlias}.id`, `${this.orderAlias}.total_amount`, `${this.orderAlias}.status`])
        .getOne(),
      this.walletRepo
        .createQueryBuilder(this.walletAlias)
        .where(`${this.walletAlias}.user_id =:userId`, { userId: user.id })
        .select([`${this.walletAlias}.id`, `${this.walletAlias}.balance`])
        .getOne(),
    ]);

    if (!order) {
      throw new BadRequestException(ErrorMessage.ORDER_NOT_FOUND);
    }

    if (order.status === OrderStatus.Returned || order.status === OrderStatus.Canceled) {
      throw new BadRequestException(ErrorMessage.ORDER_STATUS_CANNOT_UPDATE);
    }

    if (!userWallet) {
      throw new BadRequestException(ErrorMessage.INSUFFICIENT_BALANCE);
    }

    if (Number(order.total_amount) > Number(userWallet.balance)) {
      throw new BadRequestException(ErrorMessage.INSUFFICIENT_BALANCE);
    }

    await this.updateOrCreateWallet(user.id, Number(userWallet.balance) - Number(order.total_amount));

    const invoice = await this.invoiceRepo
      .createQueryBuilder(this.invoiceAlias)
      .where(`${this.invoiceAlias}.order_id =:orderId`)
      .andWhere(`${this.invoiceAlias}.status =:status`, { status: 'Unpaid' })
      .andWhere(`${this.invoiceAlias}.customer_id =:userId`, {
        orderId: orderId,
        userId: user.id,
      })
      .select([`${this.invoiceAlias}.id`, `${this.invoiceAlias}.status`, `${this.invoiceAlias}.total_amount`])
      .getOne();

    if (invoice) {
      await this.invoiceRepo.update(invoice.id, {
        status: 'PAID',
      });
    } else {
      await this.invoiceRepo.save(
        this.invoiceRepo.create({
          total_amount: order.total_amount,
          status: 'PAID',
          payment_method: method,
          customer: { id: user.id },
          order: { id: orderId },
        })
      );
    }

    // add invoice
  }

  @Transactional()
  async cancelOrder(user: UserEntity, { orderId }: CancelOrderDto) {
    const order = await this.orderRepo
      .createQueryBuilder(this.orderAlias)
      .where(`${this.orderAlias}.id =:orderId`, { orderId })
      .andWhere(`${this.orderAlias}.customer_id =:userId`, { userId: user.id })
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
      .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.orderAlias}.coupon`, this.couponAlias)
      .leftJoin(`${this.orderAlias}.invoices`, this.invoiceAlias)
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.status`,
        `${this.orderAlias}.total_amount`,
        `${this.couponAlias}.id`,
        `${this.orderDetailAlias}.id`,
        `${this.orderDetailAlias}.quantity`,
        `${this.productDetailAlias}.id`,
        `${this.invoiceAlias}.id`,
        `${this.invoiceAlias}.total_amount`,
        `${this.invoiceAlias}.status`,
      ])
      .getOne();

    if (!order) {
      throw new BadRequestException(ErrorMessage.ORDER_NOT_FOUND);
    }

    if (
      order.status === OrderStatus.Canceled ||
      order.status === OrderStatus.Completed ||
      order.status === OrderStatus.Returned
    ) {
      throw new BadRequestException(ErrorMessage.ORDER_STATUS_NOT_CHANGE);
    }

    // refund money if user cancel but paid
    if (order.invoices.length && order.invoices.some((e) => e.status === 'PAID')) {
      // tạo một hóa đơn hoàn tiền
      // trừ hóa đơn gốc về 0
      const paidInvoice = order.invoices.find((e) => e.status === 'PAID');
      await Promise.all([
        this.invoiceRepo.update(paidInvoice.id, {
          total_amount: 0,
        }),
        this.invoiceRepo.save(
          this.invoiceRepo.create({
            order: { id: orderId },
            status: 'RETURN',
            total_amount: order.total_amount,
            customer: { id: user.id },
          })
        ),
        this.walletRepo.update(
          { user: { id: user.id } },
          {
            balance: () => `balance + ${order.total_amount}`,
          }
        ),
      ]);
    }

    // restore coupon stock
    if (order.orderDetails?.length) {
      const updateOderDetailStock = order.orderDetails.map((e) =>
        this.productDetailRepo.update(e.sku.id, {
          stock: () => `stock + ${e.quantity}`,
        })
      );

      if (order.coupon) {
        const updateCoupon = this.couponRepo.update(order.coupon.id, {
          times_used: () => `times_used - 1`,
        });
        await Promise.all([...updateOderDetailStock, updateCoupon]);
      } else {
        await Promise.all(updateOderDetailStock);
      }

      // update order status, order status history
      const saveOrderHistory = this.orderHistoryRepo.save(
        this.orderHistoryRepo.create({ status: OrderStatus.Canceled, order: { id: orderId } })
      );
      const updateOrder = this.orderRepo.update(orderId, { status: OrderStatus.Canceled });

      await Promise.all([saveOrderHistory, updateOrder]);
    }

    return [];
  }
}
