import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderEntity, ProductDetailsEntity, UserEntity } from '.';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { OrderReturnStatus } from '../types';
import { ReturnOrderImgEntity } from './return-order-img.entity';

@Entity('return_order')
export class ReturnOrderEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  status: OrderReturnStatus;

  @Column({ type: 'boolean', default: false, name: 'is_approved' })
  isApprove: boolean;

  @Column({ type: 'mediumtext', nullable: true })
  reason: string;

  @Column({
    type: 'int',
    default: 0,
    unsigned: true,
    name: 'quantity',
  })
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.returnOrder, { eager: true, nullable: false })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: OrderEntity;

  @ManyToOne(() => ProductDetailsEntity, (pro_detail) => pro_detail.returnOrder, { eager: true, nullable: false })
  @JoinColumn({ name: 'product_detail_id', referencedColumnName: 'id' })
  producDetail: ProductDetailsEntity;

  @ManyToOne(() => UserEntity, (user) => user.returnOrders, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => ReturnOrderImgEntity, (return_order_img) => return_order_img.returnOrder)
  returnOrderImg: ReturnOrderImgEntity[];
}
