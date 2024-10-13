import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsString()
  productCode: string;

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
  @ValidateNested({ each: true })
  @Type(() => Variant)
  variants?: Variant[];

  @IsOptional()
  @IsNumber()
  totalVote?: number;

  @IsOptional()
  @IsNumber()
  starRate?: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'discountPercent must be a valid number' })
  @Min(0, { message: 'discountPercent must be at least 0' })
  @Max(5, { message: 'discountPercent must be no more than 5' })
  discountPercent?: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'discountPercent must be a valid number' })
  oldPrice?: number;

  @IsNotEmpty()
  @IsNumber()
  cateId: number;

  @IsNotEmpty()
  @IsNumber()
  brandId: number;
}

export class Variant {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  images: string[];

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  options: string[];
}
