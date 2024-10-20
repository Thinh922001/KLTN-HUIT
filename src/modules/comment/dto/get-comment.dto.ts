import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { UserCommentEntity } from '../../../entities';

export class GetCommentDto {
  @IsString()
  @IsNotEmpty()
  productId: number;

  @IsOptional()
  @IsNumberString()
  take: number;

  @IsOptional()
  @IsNumberString()
  skip: number;
}

export class CommentDto {
  id: number;
  comment: string;
  totalReaction: number;
  rating: number;
  img?: string[];

  constructor(commentEntity: UserCommentEntity) {
    this.id = commentEntity.id;
    this.comment = commentEntity.comment;
    this.totalReaction = commentEntity.totalReaction;
    this.rating = commentEntity.rating;
    if (commentEntity.images) {
      this.img = commentEntity.images.map((e) => e.image_url);
    }
  }
}
