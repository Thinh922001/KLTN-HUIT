import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { ClinicEntity } from './clinic.entity';
import { UserEntity } from './user.entity';

@Entity('user_clinic')
export class UserClinicEntity extends AbstractEntity {
  @Column({ type: 'datetime', nullable: true, default: null, name: 'date' })
  date: string;

  @Column({ type: 'boolean', nullable: true, default: false, name: 'status' })
  status: string;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  owner: UserEntity;

  @ManyToOne(() => ClinicEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'clinic_id', referencedColumnName: 'id' })
  clinic: ClinicEntity;
}
