import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from './index';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { OrderDetailEntity } from './order-details.entity';
import { InvoiceEntity } from './invoice.entity';
import { CouponEntity } from './coupon.entity';
import { OrderStatus, ShippingMethod } from '../types';
import { OrderStatusHistory } from './order-status-history.entity';

@Entity('order')
export class OrderEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_amount: number;

  @Column({ type: 'varchar', length: 100, nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  shipping_method: ShippingMethod;

  @Column({ type: 'text', nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  shipping_address: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, { eager: true, nullable: false })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: UserEntity;

  @ManyToOne(() => CouponEntity, (coupon) => coupon.order, { eager: true, nullable: true })
  @JoinColumn({ name: 'coupon_id', referencedColumnName: 'id' })
  coupon: CouponEntity;

  @OneToMany(() => OrderDetailEntity, (order_details) => order_details.order)
  orderDetails: OrderDetailEntity[];

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.order)
  invoices: InvoiceEntity[];

  @OneToMany(() => OrderStatusHistory, (statusHistory) => statusHistory.order)
  statusHistory: OrderStatusHistory[];
}
