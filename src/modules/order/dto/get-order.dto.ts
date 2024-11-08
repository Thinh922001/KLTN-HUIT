import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../types';
import { PagerDto } from '../../../vendors/dto/pager.dto';
import { OrderEntity } from '../../../entities';

export class GetOrder extends PagerDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  filterBy: OrderStatus;
}

export class OrderUser {
  id: number;
  totalAmount: number;
  status: string;
  name: string;
  images: string[];
  totalItems: number;

  constructor(orderEntity: OrderEntity) {
    this.id = orderEntity.id;
    this.totalAmount = orderEntity.total_amount;
    this.status = orderEntity.status;
    this.images = orderEntity.orderDetails.map((e) => e.sku.product.img);
    this.name = orderEntity.orderDetails[0].sku.product.productName;
    this.totalItems = orderEntity.orderDetails.length;
  }
}
