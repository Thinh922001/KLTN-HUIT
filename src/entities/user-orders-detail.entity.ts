import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserOrdersEntity } from './user-orders.entity';
import { ItemsEntity } from './item.entity';

@Entity('user_order_detail')
export class UserOrderDetailEntity extends AbstractEntity {
  @Column({ type: 'int', nullable: true, default: 0, name: 'amout' })
  amout: number;

  @Column({ type: 'bigint', nullable: true, default: 0, name: 'total_amount' })
  totalAmount: number;

  @ManyToOne(() => UserOrdersEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_order_id', referencedColumnName: 'id' })
  userOrder: UserOrdersEntity;

  @ManyToOne(() => ItemsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item: ItemsEntity;
}
