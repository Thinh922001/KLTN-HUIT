import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductsEntity, UserEntity } from '.';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserCommentImagesEntity } from './user-comment-images.entity';
import { UserReactionEntity } from './user-reaction.entity';

@Entity('user_comment')
export class UserCommentEntity extends AbstractEntity {
  @Column({ type: 'text', nullable: false })
  comment: string;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
    unsigned: true,
  })
  rating: number;

  @Column({
    type: 'int',
    default: 0,
    unsigned: true,
    name: 'total_reaction',
  })
  totalReaction: number;

  @OneToMany(() => UserCommentImagesEntity, (image) => image.comment)
  images: UserCommentImagesEntity[];

  @ManyToOne(() => UserEntity, (user) => user.comment, { eager: true, nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => UserCommentEntity, (parentComment) => parentComment.replies, { nullable: true })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parentComment: UserCommentEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.comment, { nullable: true })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductsEntity;

  @OneToMany(() => UserCommentEntity, (reply) => reply.parentComment)
  replies: UserCommentEntity[];

  @OneToMany(() => UserReactionEntity, (user_reaction) => user_reaction.comment)
  userReaction: UserReactionEntity[];
}
