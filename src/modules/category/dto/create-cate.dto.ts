import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cateTypeId: number;
}
