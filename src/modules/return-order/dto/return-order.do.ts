import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ReturnOrderDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsInt()
  @IsNotEmpty()
  productDetailId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
