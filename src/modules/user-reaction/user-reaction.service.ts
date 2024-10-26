import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ErrorMessage } from '../../common/message';
import { ProductsEntity, UserCommentEntity, UserReactionEntity } from '../../entities';
import { ProductRepository, UserReactionRepository } from '../../repositories';
import { AddReactionComment } from './dto/user-reaction.dto';

@Injectable()
export class UserReactionService {
  userReactAlias: string;
  productAlias: string;
  commentAlias: string;

  constructor(
    private readonly userReactionRepo: UserReactionRepository,
    private readonly productRepo: ProductRepository,
    private dataSource: DataSource
  ) {
    this.userReactAlias = UserReactionEntity.name;
    this.productAlias = ProductsEntity.name;
    this.commentAlias = UserCommentEntity.name;
  }

  async addReaction(userId: number, { commentId, reactionType, productId }: AddReactionComment) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const product = await queryRunner.manager
        .createQueryBuilder(this.productRepo.target, this.productAlias)
        .leftJoin(`${this.productAlias}.comment`, this.commentAlias)
        .where(`${this.productAlias}.id = :productId AND ${this.commentAlias}.id = :commentId`, {
          productId,
          commentId,
        })
        .select(`${this.productAlias}.id`)
        .getOne();

      if (!product) {
        throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
      }

      const reaction = await queryRunner.manager
        .createQueryBuilder(this.userReactionRepo.target, this.userReactAlias)
        .where(`${this.userReactAlias}.user_id = :userId AND ${this.userReactAlias}.comment_id = :commentId`, {
          userId,
          commentId,
        })
        .setLock('pessimistic_write')
        .getOne();

      if (reaction) {
        await queryRunner.manager.delete(this.userReactionRepo.target, { id: reaction.id });
        await queryRunner.manager.decrement(UserCommentEntity, { id: commentId }, 'totalReaction', 1);
      } else {
        const reactionEntity = this.userReactionRepo.create({
          reactionType,
          comment: { id: commentId },
          user: { id: userId },
        });

        await queryRunner.manager.save(reactionEntity);
        await queryRunner.manager.increment(UserCommentEntity, { id: commentId }, 'totalReaction', 1);
      }

      const updatedComment = await queryRunner.manager.findOne(UserCommentEntity, { where: { id: commentId } });

      await queryRunner.commitTransaction();

      return { totalReaction: updatedComment?.totalReaction ?? 0 };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
