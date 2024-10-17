import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchProductDto {
  @IsString()
  @IsNotEmpty()
  keyWord: string;

  @IsNumber()
  @IsOptional()
  take: number = 5;
}
