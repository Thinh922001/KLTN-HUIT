import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateCouponDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  code: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  discount_value: number;

  @IsString()
  @IsOptional()
  @IsIn(['percentage', 'amount'])
  @MaxLength(50)
  discount_type: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  usage_limit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  validityPeriodInDays?: number;
}
