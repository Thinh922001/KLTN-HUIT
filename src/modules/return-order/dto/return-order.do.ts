import { IsInt, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ReturnOrderDto {
  @IsNumberString()
  @IsNotEmpty()
  orderId: number;

  @IsNumberString()
  @IsNotEmpty()
  productDetailId: number;

  @IsNumberString()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
