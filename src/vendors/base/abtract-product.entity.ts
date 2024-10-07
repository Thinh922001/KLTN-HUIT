import { Column } from 'typeorm';
import { AbstractEntity } from './abtract.entity';

export class AbstractProduct extends AbstractEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'price',
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    name: 'discount_percent',
  })
  discountPercent: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    name: 'old_price',
  })
  oldPrice: number;
}
