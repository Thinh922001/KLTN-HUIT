import { IsOptional } from 'class-validator';

export class GetAllCateDto {
  @IsOptional()
  cateTypeId: number;
}
