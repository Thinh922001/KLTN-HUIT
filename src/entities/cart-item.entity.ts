import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { ItemsEntity } from './item.entity';
import { UserEntity } from './user.entity';

@Entity('carts')
export class CartsEntity extends AbstractEntity {
  @Column({ type: 'int', nullable: false, default: 1, name: 'amount' })
  amount: number;

  @Column({ type: 'bigint', nullable: false, default: 0, name: 'total_amount' })
  totalAmount;

  @Column({ type: 'datetime', name: 'expired_at', nullable: true })
  expiredAt: string | null;

  @ManyToOne(() => ItemsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'item_id', referencedColumnName: 'id' })
  item: ItemsEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  owner: UserEntity;
}
