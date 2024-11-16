import { IsNumberString, IsOptional } from 'class-validator';
import { PagerDto } from '../../../vendors/dto/pager.dto';

export class GetProductDto extends PagerDto {
  @IsNumberString()
  @IsOptional()
  cateId: number;

  @IsNumberString()
  @IsOptional()
  brandId: number;
}
