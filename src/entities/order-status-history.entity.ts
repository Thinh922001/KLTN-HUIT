import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderStatus } from '../types';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { OrderEntity } from './index';

@Entity('order_status_history')
export class OrderStatusHistory extends AbstractEntity {
  @ManyToOne(() => OrderEntity, (order) => order.statusHistory)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: OrderEntity;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;
}
