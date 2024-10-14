import { IsNotEmpty, IsNumberString } from 'class-validator';

export class AddToCartDto {
  @IsNumberString()
  @IsNotEmpty()
  detailId: number;
}
