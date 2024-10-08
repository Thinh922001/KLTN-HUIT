import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetBreadCrumbDto {
  @IsString()
  @IsNotEmpty()
  type: 'CATE' | 'DESC';

  @IsNumber()
  @IsNotEmpty()
  id: number;
}
