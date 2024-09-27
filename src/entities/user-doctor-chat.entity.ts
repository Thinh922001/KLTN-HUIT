import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserEntity } from './user.entity';
import { DoctorsEntity } from './doctor.entity';
import { IChatInfo } from '../common/constaints';

@Entity('user_doctor_chats')
export class UserDoctorChatEntity extends AbstractEntity {
  @Column({ type: 'date', nullable: false, name: 'date', unique: true })
  date: string;

  @Column({ type: 'simple-json', nullable: true, name: 'message' })
  message: IChatInfo;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => DoctorsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: DoctorsEntity;
}
