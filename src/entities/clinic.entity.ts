import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { AreaEntity } from './area.entity';

@Entity('clinics')
export class ClinicEntity extends AbstractEntity {
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @IsNotEmpty({ message: 'Email can not be null or empty' })
  @Column({ type: 'varchar', nullable: false, length: 255, default: false, name: 'name' })
  name: string;

  @IsString({ message: 'LocationName is not valid' })
  @Column({ type: 'varchar', nullable: true, length: 255, default: null, name: 'location_name' })
  locationName: string;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: false })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: false })
  latitude: number;

  @IsString({ message: 'Image is not valid' })
  @Column({ type: 'varchar', nullable: true, length: 255, default: null, name: 'image' })
  image: string;

  @IsString({ message: 'Phone is not valid' })
  @Column({ type: 'varchar', nullable: true, length: 15, default: null, name: 'phone' })
  phone: string;

  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @IsNotEmpty({ message: 'Email can not be null or empty' })
  @Column({ type: 'varchar', nullable: false, length: 255, default: false, name: 'na' })
  time: string;

  @ManyToOne(() => AreaEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'area_id', referencedColumnName: 'id' })
  area: AreaEntity;
}
