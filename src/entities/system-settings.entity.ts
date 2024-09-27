import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('system_settings')
export class SystemSettingsEntity extends AbstractEntity {
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @IsNotEmpty({ message: 'Key can not be null or empty' })
  @Column({ type: 'varchar', nullable: false, length: 255, default: false, name: 'key' })
  key: string;

  @IsNotEmpty({ message: 'Value can not be null or empty' })
  @Column({ type: 'int', nullable: false, default: false, name: 'value' })
  value: number;
}
