import { Injectable } from '@nestjs/common';
import { OrderDetailRepository, OrderRepository } from '../../repositories';
import { OrderDetailEntity, OrderEntity, ProductDetailsEntity, ProductsEntity, UserEntity } from '../../entities';
import { GetOrderDetail, GetOrderResponse } from './dto/get-order-detail.dto';
import { getTableName } from '../../utils/utils';

@Injectable()
export class OrderDetailService {
  orderDetailAlias: string;
  productDetailAlias: string;
  productAlias: string;
  orderAlias: string;
  userAlias: string;
  constructor(private readonly orderRepo: OrderRepository, private readonly orderDetailRepo: OrderDetailRepository) {
    this.orderDetailAlias = getTableName(OrderDetailEntity);
    this.productDetailAlias = getTableName(ProductDetailsEntity);
    this.productAlias = getTableName(ProductsEntity);
    this.orderAlias = getTableName(OrderEntity);
    this.userAlias = getTableName(UserEntity);
  }

  async getOrderDetail(user: UserEntity, params: GetOrderDetail) {
    const orderEntity = await this.orderRepo
      .createQueryBuilder(this.orderAlias)
      .withDeleted()
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
      .leftJoin(`${this.orderAlias}.customer`, this.userAlias)
      .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.productDetailAlias}.product`, this.productAlias)
      .where(`${this.orderAlias}.id =:orderId`, { orderId: params.orderId })
      .andWhere(`${this.orderAlias}.customer_id =:userId`, { userId: user.id })
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.shipping_address`,
        `${this.orderAlias}.updatedAt`,
        `${this.orderAlias}.createdAt`,
        `${this.orderAlias}.total_amount`,
        `${this.userAlias}.id`,
        `${this.userAlias}.name`,
        `${this.userAlias}.phone`,
        `${this.userAlias}.gender`,
        `${this.orderDetailAlias}.id`,
        `${this.orderDetailAlias}.quantity`,
        `${this.orderDetailAlias}.total_price`,
        `${this.productDetailAlias}.id`,
        `${this.productDetailAlias}.variationDetails`,
        `${this.productAlias}.id`,
        `${this.productAlias}.productName`,
        `${this.productAlias}.img`,
      ])
      .getOne();

    return new GetOrderResponse(orderEntity);
  }

  async getOrderDetailFormOrderId(orderId: number) {
    const orderEntity = await this.orderRepo
      .createQueryBuilder(this.orderAlias)
      .withDeleted()
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailAlias)
      .leftJoin(`${this.orderAlias}.customer`, this.userAlias)
      .leftJoin(`${this.orderDetailAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.productDetailAlias}.product`, this.productAlias)
      .where(`${this.orderAlias}.id =:orderId`, { orderId })
      .select([
        `${this.orderAlias}.id`,
        `${this.orderAlias}.shipping_address`,
        `${this.orderAlias}.updatedAt`,
        `${this.orderAlias}.createdAt`,
        `${this.orderAlias}.total_amount`,
        `${this.userAlias}.id`,
        `${this.userAlias}.name`,
        `${this.userAlias}.phone`,
        `${this.userAlias}.gender`,
        `${this.orderDetailAlias}.id`,
        `${this.orderDetailAlias}.quantity`,
        `${this.orderDetailAlias}.total_price`,
        `${this.productDetailAlias}.id`,
        `${this.productDetailAlias}.variationDetails`,
        `${this.productAlias}.id`,
        `${this.productAlias}.productName`,
        `${this.productAlias}.img`,
      ])
      .getOne();

    return new GetOrderResponse(orderEntity);
  }
}
