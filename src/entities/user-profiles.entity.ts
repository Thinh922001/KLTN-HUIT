import { MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GENDERS } from '../common/constaints';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserEntity } from './user.entity';

@Entity('user_profiles')
export class UserProfileEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  owner: UserEntity;

  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @MaxLength(255, {
    message: `name length must be equal or less than 255 characters`,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'enum', default: GENDERS.FEMALE, nullable: true, enum: GENDERS })
  gender: GENDERS;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate: Date;

  @Column({
    type: 'decimal',
    default: 0,
    precision: 5,
    scale: 2,
    nullable: true,
    unsigned: true,
  })
  height: number | null;

  @Column({
    type: 'decimal',
    default: 0,
    precision: 5,
    scale: 2,
    nullable: true,
    unsigned: true,
  })
  weight: number | null;

  @MaxLength(5, {
    message: `name length must be equal or less than 255 characters`,
  })
  @Column({ type: 'varchar', length: 5, nullable: true, name: 'blood_group' })
  bloodGroup: string;
}
