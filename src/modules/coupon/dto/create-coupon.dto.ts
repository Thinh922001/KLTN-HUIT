import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @MaxLength(100)
  code: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  discountValue: number;

  @IsString()
  @IsIn(['percentage', 'amount'])
  @MaxLength(50)
  discountType: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  usageLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  validityPeriodInDays?: number; // Thời hạn sử dụng của coupon, tính bằng số ngày
}
