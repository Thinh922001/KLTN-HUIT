import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserCommentEntity } from './user-comment.entity';

@Entity('user_comment_images')
export class UserCommentImagesEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  image_url: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'public_id',
  })
  publicId: string;

  @ManyToOne(() => UserCommentEntity, (comment) => comment.images, { eager: true, nullable: true })
  @JoinColumn({ name: 'comment_id', referencedColumnName: 'id' })
  comment: UserCommentEntity;
}
