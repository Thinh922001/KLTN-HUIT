import { IsNotEmpty } from 'class-validator';

export class GetBrandByCateDto {
  @IsNotEmpty()
  cateId: number;
}
