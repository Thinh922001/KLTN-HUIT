import { AbstractEntity } from '../vendors/base/abtract.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('coupon')
export class CouponEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_value: number;

  @Column({ type: 'varchar', length: 50 })
  discount_type: string; // "percentage" || "amount"

  @Column({ type: 'datetime', nullable: true })
  expiration_date: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', nullable: true })
  usage_limit: number;

  @Column({ type: 'int', default: 0 })
  times_used: number;

  @OneToMany(() => OrderEntity, (order) => order.coupon)
  order: OrderEntity[];
}
