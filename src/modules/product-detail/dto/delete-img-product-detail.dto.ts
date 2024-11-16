import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteImgDto {
  @IsNumber()
  @IsNotEmpty()
  productDetailId: number;

  @IsNotEmpty()
  @IsArray()
  delImgId: number[];
}
