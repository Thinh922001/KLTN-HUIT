import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCateDto {
  @IsNumber()
  @IsNotEmpty()
  cateId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
