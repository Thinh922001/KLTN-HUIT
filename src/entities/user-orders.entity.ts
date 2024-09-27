import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserEntity } from './user.entity';

@Entity('user_orders')
export class UserOrdersEntity extends AbstractEntity {
  @Column({ type: 'date', nullable: true, default: null, name: 'date' })
  date: string;

  @Column({ type: 'bigint', nullable: true, default: null, name: 'total_amout' })
  totalAmout: number;

  @Column({ type: 'boolean', nullable: true, default: false, name: 'status' })
  status: number;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  owner: UserEntity;
}
