import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../repositories';
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
import { applyPagination, getTableName } from '../../utils/utils';

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
    private readonly OrderRepo: OrderRepository
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
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.status`,
        `${this.orderAlias}.total_amount`,
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
      orderCustomer = await userRepo.findOne({ where: { phone: auth.phone }, select: ['id'] });
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
      .select([`${this.productDetailAlias}.id`, `${this.productDetailAlias}.price`, `${this.productDetailAlias}.stock`])
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

    return savedOrder;
  }
}
