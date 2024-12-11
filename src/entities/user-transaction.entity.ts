import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '.';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('user_transactions')
export class UserTransactionEntity extends AbstractEntity {
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    name: 'amount',
  })
  amount: number;

  @Column({
    type: 'varchar',
    name: 'status',
    default: 'PENDING',
  })
  status: string;

  @Column({
    type: 'varchar',
    name: 'payment_method',
  })
  paymentMethod: string;

  @ManyToOne(() => UserEntity, (user) => user.userTransactions, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
