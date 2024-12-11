import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '.';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { DistrictEntity } from './district.entity';

@Entity('wallets')
export class WalletsEntity extends AbstractEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  balance: number;

  @ManyToOne(() => DistrictEntity, (district) => district.wards, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
