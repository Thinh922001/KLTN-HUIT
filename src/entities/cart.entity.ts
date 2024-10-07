import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { CartItemEntity } from './cart-items.entity';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { UserEntity } from '.';

@Entity('cart')
export class CartEntity extends AbstractEntity {
  @Column()
  customer_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_price: number;

  @Column({ type: 'datetime', nullable: true })
  expiration_date: Date;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, { cascade: true })
  cart_items: CartItemEntity[];

  @OneToOne(() => UserEntity, (user) => user.cart, { eager: true, nullable: false })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: UserEntity;
}
