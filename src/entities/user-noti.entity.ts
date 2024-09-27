import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserEntity } from './user.entity';

@Entity('user_noti')
export class UserNotiEntity extends AbstractEntity {
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @IsNotEmpty({ message: 'Title can not be null or empty' })
  @Column({ type: 'varchar', nullable: false, length: 255, default: false, name: 'title' })
  title: string;

  @Column({ type: 'mediumtext', nullable: true, name: 'content' })
  content: string;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  owner: UserEntity;
}
