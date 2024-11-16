import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { OrderStatus } from '../../../types';

export class UpdateOrderStatus {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
