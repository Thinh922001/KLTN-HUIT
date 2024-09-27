import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('items_type')
export class ItemsTypeEntity extends AbstractEntity {
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @IsNotEmpty({ message: 'Email can not be null or empty' })
  @Column({ type: 'varchar', nullable: false, length: 255, default: false, name: 'name' })
  name: string;
}
