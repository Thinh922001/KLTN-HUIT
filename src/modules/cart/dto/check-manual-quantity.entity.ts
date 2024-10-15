import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsNumberString, ValidateNested } from 'class-validator';

export class CartItemsQuantity {
  @IsNumber()
  @IsNotEmpty()
  productDetailId: string;

  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'quantity must be a valid number' })
  @IsNotEmpty()
  quantity: number;
}

export class CheckManualQuantity {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemsQuantity)
  cartItems: CartItemsQuantity[];
}
