import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export interface IVariant {
  variant: Record<string | number, string | number>;
}
export class GetDetailProduct {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsOptional()
  variation: IVariant[];
}
