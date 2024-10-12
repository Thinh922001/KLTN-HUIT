import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class GetBreadCrumbDto {
  @IsString()
  @IsNotEmpty()
  type: 'CATE' | 'DESC';

  @IsNumberString()
  @IsNotEmpty()
  id: number;
}
