import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { SNS_TYPE } from '../common/constaints';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string | null;

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

  @Column({ type: 'enum', enum: SNS_TYPE, nullable: true, default: null, name: 'sns_type' })
  @IsEnum(SNS_TYPE)
  snsType: SNS_TYPE;

  @Column({ type: 'mediumtext', nullable: true })
  refreshToken: string;
}
