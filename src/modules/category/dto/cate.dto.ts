import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PagerDto } from '../../../vendors/dto/pager.dto';

export interface IOrderBy {
  [key: string]: 'ASC' | 'DESC';
}

export interface ISearch {
  [key: string]: number[];
}
export class GetCateDto extends PagerDto {
  @IsNotEmpty()
  @IsNumber()
  cateId: number;

  @IsOptional()
  orderBy: IOrderBy;

  @IsOptional()
  filters: ISearch;
}
