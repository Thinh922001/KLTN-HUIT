import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserEntity } from './user.entity';
import { ItemsEntity } from './item.entity';

@Entity('user_comment_item')
export class UserCommentItemEntity extends AbstractEntity {
  @IsNotEmpty({ message: 'Email can not be null or empty' })
  @Column({ type: 'mediumtext', nullable: true, default: null, name: 'message' })
  message: string;

  @Column({ type: 'int', nullable: true, default: 5, name: 'rate' })
  rate: number;

  @Column({ type: 'datetime', nullable: true, default: null, name: 'date' })
  date: string;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  owner: UserEntity;

  @ManyToOne(() => ItemsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item: ItemsEntity;
}
