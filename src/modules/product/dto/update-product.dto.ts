import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProduct {
  @IsOptional()
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  product_code: string;

  @IsOptional()
  textOnlineType?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tabs?: string[];

  @IsOptional()
  @IsArray()
  labelsId?: number[];

  @IsOptional()
  @IsNumber()
  totalVote?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'starRate must be at least 0' })
  @Max(5, { message: 'starRate must be no more than 5' })
  starRate?: number;

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
  cateId: number;

  @IsOptional()
  @IsNumber()
  brandId: number;

  variants: any;
}
