import { IsNotEmpty, IsNumber } from 'class-validator';
import { PagerDto } from '../../../vendors/dto/pager.dto';

export class GetCateDto extends PagerDto {
  @IsNotEmpty()
  @IsNumber()
  cateId: number;
}
