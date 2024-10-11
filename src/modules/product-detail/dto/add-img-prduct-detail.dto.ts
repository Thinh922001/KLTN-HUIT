import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddImgDto {
  @IsNumber()
  @IsNotEmpty()
  productDetailId: number;
}
