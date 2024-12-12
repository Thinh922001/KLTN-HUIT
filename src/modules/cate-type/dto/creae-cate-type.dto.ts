import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCateTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateCateTypeDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
