import { IsNotEmpty, IsNumber } from 'class-validator';

export class GenSkuDto {
  @IsNotEmpty()
  productId: number;
}
