import { Injectable } from '@nestjs/common';
import {
  CouponRepository,
  InvoiceRepository,
  OrderDetailRepository,
  OrderRepository,
  ProductDetailsRepository,
} from '../../repositories';
import { OrderDto } from './dto/order.dto';
import {
  CartEntity,
  CartItemEntity,
  CouponEntity,
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
import { OrderStatus, ShippingMethod } from '../../types';
import { GetOrder, OrderUser } from './dto/get-order.dto';
import { applyPagination, convertHttpToHttps, getTableName } from '../../utils/utils';
import { GetOrderAd } from './dto/get-order-admin';
import { UpdateOrderStatus } from './dto/update-order-status.dto';
import { OrderStatusHistoryRepository } from '../../repositories/order-status-history.repository';
import { MailService } from '../mail/mail.service';
import { AdminRepository } from '../../repositories/admin.repository';

@Injectable()
export class OrderService {
  productDetailAlias: string;
  productAlias: string;
  userAlias: string;
  cartItemAlias: string;
  couponAlias: string;
  orderAlias: string;
  orderDetailAlias: string;
  constructor(
    private readonly cartService: CartService,
    private readonly couponService: CouponService,
    private readonly mailService: MailService,
    private readonly OrderRepo: OrderRepository,
    private readonly productDetailRepo: ProductDetailsRepository,
    private readonly couponRepo: CouponRepository,
    private readonly invoiceRepo: InvoiceRepository,
    private readonly orderHistoryRepo: OrderStatusHistoryRepository,
    private readonly adminRepo: AdminRepository
  ) {
    this.productDetailAlias = getTableName(ProductDetailsEntity);
    this.productAlias = getTableName(ProductsEntity);
    this.userAlias = UserEntity.name;
    this.cartItemAlias = CartItemEntity.name;
    this.couponAlias = CouponEntity.name;
    this.orderAlias = getTableName(OrderEntity);
    this.orderDetailAlias = getTableName(OrderDetailEntity);
  }

  public async getOrder(user: UserEntity, { filterBy, take = 3, skip }: GetOrder) {
    const query = this.OrderRepo.createQueryBuilder(this.orderAlias)
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

  @Transactional()
  async createOrder(user: UserEntity, { carts, auth, coupon, note, address }: OrderDto) {
    const cartMap = new Map(carts.map((e) => [e.id, e]));
    const productDetailRepo = this.OrderRepo.manager.getRepository(ProductDetailsEntity);
    const userRepo = this.OrderRepo.manager.getRepository(UserEntity);
    const orderDetailRepo = this.OrderRepo.manager.getRepository(OrderDetailEntity);
    const statusOrderHistoryRepo = this.OrderRepo.manager.getRepository(OrderStatusHistory);
    const cartRepo = this.OrderRepo.manager.getRepository(CartEntity);
    const cartItemsRepo = this.OrderRepo.manager.getRepository(CartItemEntity);
    const couponRepo = this.OrderRepo.manager.getRepository(CouponEntity);

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

    const newOrder = this.OrderRepo.create({
      status: OrderStatus.PENDING,
      total_amount: totalAmount,
      shipping_method: ShippingMethod.STANDARD,
      shipping_address: address,
      note: note,
      customer: orderCustomer,
      coupon: couponData ? { id: couponData.id } : null,
    });
    const savedOrder = await this.OrderRepo.save(newOrder);

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
      status: OrderStatus.PENDING,
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
    const query = this.OrderRepo.createQueryBuilder(this.orderAlias)
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
    return await this.OrderRepo.createQueryBuilder(this.orderAlias)
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

  @Transactional()
  async updateOrderStatus({ status, orderId }: UpdateOrderStatus) {
    const order = await this.OrderRepo.createQueryBuilder(this.orderAlias)
      .where(`${this.orderAlias}.id =:orderId`, { orderId })
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
      .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.orderAlias}.coupon`, this.couponAlias)
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
      ])
      .getOne();

    if (order.status === OrderStatus.PENDING) {
      const invalidStatuses = [
        OrderStatus.DELIVERED,
        OrderStatus.PENDING,
        OrderStatus.REFUNDED,
        OrderStatus.SHIPPED,
        OrderStatus.RETURNED,
      ];

      if (invalidStatuses.includes(status)) {
        throw new BadRequestException(ErrorMessage.ORDER_STATUS_INVALID);
      }
    }

    if (order.status === OrderStatus.CONFIRMED) {
      const invalidStatuses = [
        OrderStatus.DELIVERED,
        OrderStatus.PENDING,
        OrderStatus.REFUNDED,
        OrderStatus.RETURNED,
        OrderStatus.CONFIRMED,
      ];

      if (invalidStatuses.includes(status)) {
        throw new BadRequestException(ErrorMessage.ORDER_STATUS_INVALID);
      }
    }

    if (order.status === OrderStatus.SHIPPED) {
      const invalidStatuses = [
        OrderStatus.PENDING,
        OrderStatus.REFUNDED,
        OrderStatus.PENDING,
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED,
      ];

      if (invalidStatuses.includes(status)) {
        throw new BadRequestException(ErrorMessage.ORDER_STATUS_INVALID);
      }
    }

    if (order.status === OrderStatus.DELIVERED) {
      const invalidStatuses = [
        OrderStatus.RETURNED,
        OrderStatus.PENDING,
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED,
        OrderStatus.DELIVERED,
        OrderStatus.CONFIRMED,
      ];

      if (invalidStatuses.includes(status)) {
        throw new BadRequestException(ErrorMessage.ORDER_STATUS_INVALID);
      }
    }

    if (!order) {
      throw new BadRequestException(ErrorMessage.ORDER_NOT_FOUND);
    }

    if (order.status === status) {
      throw new BadRequestException(ErrorMessage.ORDER_STATUS_NOT_CHANGE);
    }

    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.RETURNED ||
      order.status === OrderStatus.REFUNDED
    ) {
      throw new BadRequestException(ErrorMessage.ORDER_STATUS_CANNOT_UPDATE);
    }

    // refund stock, coupon
    if (status === OrderStatus.CANCELLED || status === OrderStatus.RETURNED || status === OrderStatus.REFUNDED) {
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

    if (status === OrderStatus.DELIVERED) {
      await this.invoiceRepo.save(
        this.invoiceRepo.create({
          order: { id: orderId },
          customer: { id: order.customer.id },
          total_amount: order.total_amount,
          payment_method: 'CASH',
          status: 'PAID',
        })
      );
    }

    if (status === OrderStatus.REFUNDED) {
      await this.invoiceRepo.softDelete({ order: { id: orderId } });
    }

    const saveOrderHistory = this.orderHistoryRepo.save(
      this.orderHistoryRepo.create({ status: status, order: { id: orderId } })
    );
    const updateOrder = this.OrderRepo.update(orderId, { status: status });

    await Promise.all([saveOrderHistory, updateOrder]);

    return [];
  }
}
