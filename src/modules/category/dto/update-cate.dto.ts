import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCateDto {
  @IsNumber()
  @IsNotEmpty()
  cateId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  cateTypeId: number;
}
