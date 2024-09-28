import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { DistrictEntity } from './district.entity';

@Entity('province')
export class ProvinceEntity extends AbstractEntity {
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

  @OneToMany(() => DistrictEntity, (district) => district.province)
  districts: DistrictEntity[];
}
