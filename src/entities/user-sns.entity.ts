import { MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SNS_TYPE } from '../common/constaints';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserEntity } from './user.entity';

@Entity('user_sns')
export class UserSnsEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  owner: UserEntity;

  @Column({ type: 'enum', enum: SNS_TYPE, name: 'sns_service_type', nullable: false })
  snsServiceType: SNS_TYPE;

  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 260, nullable: true, name: 'account_sns_id' })
  accountSnsId: string;
}
