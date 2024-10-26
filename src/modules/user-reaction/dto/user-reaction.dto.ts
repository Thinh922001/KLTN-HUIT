import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ReactionType } from '../../../types';

export class AddReactionComment {
  @IsNotEmpty()
  @IsNumber()
  commentId: number;

  @IsNotEmpty()
  @IsEnum(ReactionType)
  reactionType: ReactionType;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
