import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { DistrictEntity } from './district.entity';

@Entity('ward')
export class WardEntity extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: false,
  })
  name: string;

  @ManyToOne(() => DistrictEntity, (district) => district.wards, { eager: true, nullable: false })
  @JoinColumn({ name: 'district_id', referencedColumnName: 'id' })
  district: DistrictEntity;
}
