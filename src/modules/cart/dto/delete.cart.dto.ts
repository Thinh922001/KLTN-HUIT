import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteCartDto {
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  skuId: number;
}
