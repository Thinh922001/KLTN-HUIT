import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ProvinceEntity } from './province.entity';
import { WardEntity } from './ward.entity';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('district')
export class DistrictEntity extends AbstractEntity {
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

  @ManyToOne(() => ProvinceEntity, (province) => province.districts, { eager: true, nullable: false })
  @JoinColumn({ name: 'province_id', referencedColumnName: 'id' })
  province: ProvinceEntity;

  @OneToMany(() => WardEntity, (ward) => ward.district)
  wards: WardEntity[];
}
