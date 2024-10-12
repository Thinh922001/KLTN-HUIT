import { IsNotEmpty, IsNumber } from 'class-validator';

export class GenSkuDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
