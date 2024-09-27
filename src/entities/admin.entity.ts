import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('admins')
export class AdminEntity extends AbstractEntity {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email can not be null or empty' })
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Exclude()
  @IsNotEmpty({ message: 'Password can not be null or empty' })
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @IsNotEmpty({ message: 'isAdmin can not be null or empty' })
  @Column({ type: 'boolean', nullable: false, default: true, name: 'is_admin' })
  isAdmin: boolean;

  @IsNotEmpty({ message: 'Status can not be null or empty' })
  @Column({ type: 'boolean', nullable: false, default: false, name: 'status' })
  status: boolean;

  @Column({ type: 'mediumtext', nullable: true })
  refreshToken: string;
}
