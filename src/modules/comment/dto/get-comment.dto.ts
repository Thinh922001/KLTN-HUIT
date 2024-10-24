import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { UserCommentEntity } from '../../../entities';
import { hidePhoneNumber } from '../../../utils/utils';

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

export class IAuthComment {
  id: number;
  aliasName: string;
}

export class CommentDto {
  id: number;
  comment: string;
  totalReaction: number;
  rating: number;
  img?: string[];
  owner: IAuthComment;

  constructor(commentEntity: UserCommentEntity) {
    this.id = commentEntity.id;
    this.comment = commentEntity.comment;
    this.totalReaction = commentEntity.totalReaction;
    this.rating = commentEntity.rating;
    if (commentEntity.images) {
      this.img = commentEntity.images.map((e) => e.image_url);
    }
    if (commentEntity.user) {
      const { id, name, phone } = commentEntity.user;
      this.owner.id = id;
      this.owner.aliasName = name ? name : hidePhoneNumber(phone);
    }
  }
}
