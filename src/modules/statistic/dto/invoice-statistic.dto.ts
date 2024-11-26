import { IsIn, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { PagerDto } from '../../../vendors/dto/pager.dto';

export class Stats {
  @IsIn(['DAY', 'WEEK', 'QUARTER', 'MONTH', 'YEAR', 'TODAY'], {
    message: 'Mode must be one of the following: DAY, WEEK, QUARTER, MONTH, YEAR',
  })
  @IsNotEmpty()
  mode: 'DAY' | 'WEEK' | 'QUARTER' | 'MONTH' | 'YEAR' | 'TODAY';

  @IsOptional()
  year?: number;

  @IsOptional()
  month?: number;

  @IsOptional()
  day?: number;

  @IsOptional()
  week?: number;

  @IsOptional()
  quarter?: number;

  @IsOptional()
  limit?: number;
}

export class GetLowSelling extends PagerDto {}
