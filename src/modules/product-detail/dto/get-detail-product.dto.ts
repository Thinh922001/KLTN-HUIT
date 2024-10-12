import { IsNotEmpty, IsOptional, IsNumberString } from 'class-validator';

export interface IVariant {
  variant: Record<string | number, string | number>;
}
export class GetDetailProduct {
  @IsNumberString()
  @IsNotEmpty()
  productId: number;

  @IsOptional()
  variation: IVariant;
}
