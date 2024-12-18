import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../types';
import { PagerDto } from '../../../vendors/dto/pager.dto';
import { OrderEntity } from '../../../entities';

export class GetOrder extends PagerDto {
  @IsOptional()
  filterBy: OrderStatus;
}

export class OrderUser {
  id: number;
  totalAmount: number;
  status: string;
  name: string;
  images: string[];
  totalItems: number;
  isPaid: boolean;

  constructor(orderEntity: OrderEntity) {
    this.id = orderEntity.id;
    this.totalAmount = orderEntity.total_amount;
    this.status = orderEntity.status;
    this.images = orderEntity.orderDetails.map((e) => e.sku.product.img);
    const color =
      orderEntity.orderDetails[0].sku.variationDetails &&
      orderEntity.orderDetails[0].sku.variationDetails['color'] !== undefined &&
      orderEntity.orderDetails[0].sku.variationDetails['color'] !== null
        ? String(orderEntity.orderDetails[0].sku.variationDetails['color'])
        : '';
    this.name = orderEntity.orderDetails[0].sku.product.productName + (color ? ' ' + color : '');

    this.totalItems = orderEntity.orderDetails.length;
    this.isPaid = orderEntity.invoices.some((e) => e.status === 'PAID');
  }
}
