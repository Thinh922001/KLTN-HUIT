import { IsString, IsNotEmpty, IsEnum, IsNumberString, ValidateIf, Matches } from 'class-validator';

export enum CommentType {
  NO_AUTH = 'NO_AUTH',
  AUTH = 'AUTH',
}

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

  @IsEnum(CommentType)
  @IsNotEmpty()
  type: CommentType;

  @ValidateIf((o) => o.type === CommentType.NO_AUTH)
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,11}$/, { message: 'Số điện thoại phải bao gồm 10-11 chữ số' })
  phone: string;

  @ValidateIf((o) => o.type === CommentType.NO_AUTH)
  @IsString()
  @IsNotEmpty()
  fullName: string;
}
