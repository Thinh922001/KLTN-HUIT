import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { LabelProductEntity } from './label-product.entity';

@Entity('labels')
export class LabelEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: false,
  })
  text: string;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
  })
  type: number;

  @OneToMany(() => LabelProductEntity, (labelProduct) => labelProduct.label)
  labelProducts: LabelProductEntity[];
}
