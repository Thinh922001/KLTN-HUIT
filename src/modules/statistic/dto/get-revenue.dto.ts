import { IsIn, IsInt, IsNumberString, IsOptional, ValidateIf } from 'class-validator';

export class GetRevenue {
  @IsIn(['day', 'month', 'quarter'], { message: 'Mode must be one of: day, month, quarter' })
  mode: 'day' | 'month' | 'quarter';

  @IsNumberString({ message: 'Year must be an integer' })
  year: number;

  @ValidateIf((o) => o.mode === 'day')
  @IsNumberString({ message: 'Month must be an integer' })
  month?: number;
}
