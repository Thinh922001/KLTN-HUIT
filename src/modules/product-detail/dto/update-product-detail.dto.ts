import { IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDetail {
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'price must be a valid number' })
  price: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'discountPercent must be a valid number' })
  discountPercent?: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'oldPrice must be a valid number' })
  oldPrice?: number;

  @IsOptional()
  @IsNumber()
  stock: number;
}
