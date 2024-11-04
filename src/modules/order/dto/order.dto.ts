import { IsArray, IsNotEmpty, IsString, ValidateNested, IsEnum, IsOptional, ValidateIf } from 'class-validator';

import { Type } from 'class-transformer';
import { CartDto } from '../../../modules/cart/dto/sync-cart.dto';
import { Gender } from '../../../types';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}

export class OrderDto {
  @ValidateIf((o) => o.type === 'NO_AUTH')
  @ValidateNested()
  @Type(() => AuthDto)
  auth?: AuthDto;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CartDto)
  carts: CartDto[];

  @IsEnum(['AUTH', 'NO_AUTH'])
  type: 'AUTH' | 'NO_AUTH';

  @IsString()
  @IsOptional()
  coupon?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
