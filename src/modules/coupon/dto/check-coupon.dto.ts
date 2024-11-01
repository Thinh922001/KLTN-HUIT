import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckCouponDto {
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsString()
  code: string;
}
