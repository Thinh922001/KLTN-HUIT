import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumberString()
  @IsNotEmpty()
  rating: number;

  @IsNumberString()
  @IsNotEmpty()
  productId: number;

  @IsNumberString()
  @IsNotEmpty()
  userId: number;
}
