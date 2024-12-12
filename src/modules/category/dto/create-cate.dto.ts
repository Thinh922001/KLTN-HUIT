import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  cateTypeId: number;
}
