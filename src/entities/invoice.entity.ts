import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { UserEntity } from '.';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('Invoice')
export class InvoiceEntity extends AbstractEntity {
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_amount: number;

  @Column({ type: 'varchar', length: 50, default: 'Unpaid' })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_method: string;

  @ManyToOne(() => OrderEntity, (order) => order.invoices, { eager: true, nullable: false })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: OrderEntity;

  @ManyToOne(() => UserEntity, (user) => user.invoices, { eager: true, nullable: false })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: UserEntity;
}
