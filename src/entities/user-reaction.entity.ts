import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserCommentEntity, UserEntity } from '.';
import { ReactionType } from '../types';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('user_reaction')
export class UserReactionEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'reaction_type',
  })
  reactionType: ReactionType;

  @ManyToOne(() => UserEntity, (user) => user.reaction, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => UserCommentEntity, (user_comment) => user_comment.userReaction, { eager: true, nullable: false })
  @JoinColumn({ name: 'comment_id', referencedColumnName: 'id' })
  comment: UserCommentEntity;
}
