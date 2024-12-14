import { IsInt, IsNotEmpty } from 'class-validator';

export class CancelOrderDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;
}
