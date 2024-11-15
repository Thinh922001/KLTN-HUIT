import { Exclude } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('admin')
export class AdminEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    name: 'role_name',
  })
  roleName: string;

  @Exclude()
  @IsNotEmpty({ message: 'Password can not be null or empty' })
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;
}
