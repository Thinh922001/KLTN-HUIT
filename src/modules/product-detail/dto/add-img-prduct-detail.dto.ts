import { IsNotEmpty, IsNumberString } from 'class-validator';

export class AddImgDto {
  @IsNumberString()
  @IsNotEmpty()
  productDetailId: number;
}
