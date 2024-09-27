import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { DoctorsEntity } from './doctor.entity';
import { UserEntity } from './user.entity';

@Entity('user_doctor_health_care')
export class UserDoctorHealthCareEntity extends AbstractEntity {
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @IsNotEmpty({ message: 'Email can not be null or empty' })
  @Column({ type: 'varchar', nullable: false, length: 255, default: false, name: 'name' })
  address: string;

  @Column({ type: 'bigint', nullable: false, default: 0, name: 'cost' })
  cost: string;

  @IsBoolean({ message: 'status is not valid' })
  @Column({ type: 'boolean', nullable: true, default: true, name: 'status' })
  status: boolean;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => DoctorsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'doctor_id', referencedColumnName: 'id' })
  doctor: DoctorsEntity;
}
