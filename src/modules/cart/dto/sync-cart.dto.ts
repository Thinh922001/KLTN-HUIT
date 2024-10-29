import { IsArray, IsInt, IsNotEmpty, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartDto {
  @IsInt({ message: 'ID phải là số nguyên' })
  @IsNotEmpty()
  @IsPositive({ message: 'ID phải lớn hơn 0' })
  id: number;

  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @IsNotEmpty()
  @IsPositive({ message: 'Số lượng phải lớn hơn 0' })
  quantity: number;
}

export class SyncCartDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CartDto)
  carts: CartDto[];
}
