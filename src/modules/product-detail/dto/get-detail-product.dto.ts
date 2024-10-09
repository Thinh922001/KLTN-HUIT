import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetDetailProduct {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
