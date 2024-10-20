import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserReactionEntity } from '../../entities';
import { UserReactionRepository } from '../../repositories';
import { AddReactionComment } from './dto/user-reaction.dto';

@Injectable()
export class UserReactionService {
  userReactAlias: string;

  constructor(private readonly userReactionRepo: UserReactionRepository, private dataSource: DataSource) {
    this.userReactAlias = UserReactionEntity.name;
  }

  async addReaction(userId: number, { commentId, reactionType }: AddReactionComment) {
    const reaction = await this.userReactionRepo
      .createQueryBuilder(this.userReactAlias)
      .where(`${this.userReactAlias}.user_id = :userId AND ${this.userReactAlias}.comment_id = :commentId`, {
        userId,
        commentId,
      })
      .getOne();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      if (reaction) {
        await this.userReactionRepo.delete({ id: reaction.id });

        await queryRunner.manager.query(`UPDATE user_comment SET total_reaction = total_reaction - 1 WHERE id = ?`, [
          commentId,
        ]);
      } else {
        const reactionEntity = this.userReactionRepo.create({
          reactionType: reactionType,
          comment: { id: commentId },
          user: { id: userId },
        });

        await this.userReactionRepo.save(reactionEntity);

        await queryRunner.manager.query(`UPDATE user_comment SET total_reaction = total_reaction + 1 WHERE id = ?`, [
          commentId,
        ]);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return [];
  }
}
