import { IsNotEmpty, IsNumber, IsSemVer, IsString } from 'class-validator';

export class UpdateBrandDto {
  @IsNumber()
  @IsNotEmpty()
  brandId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
