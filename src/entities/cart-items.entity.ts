import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CartEntity } from './cart.entity';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { ProductDetailsEntity } from './product-details.entity';

@Entity('cart_item')
export class CartItemEntity extends AbstractEntity {
  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_price: number;

  @ManyToOne(() => CartEntity, (cart) => cart.cart_items, { eager: true, nullable: false })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: CartEntity;

  @ManyToOne(() => ProductDetailsEntity, (product_details) => product_details.cartItems, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'sku_id', referencedColumnName: 'id' })
  sku: ProductDetailsEntity;
}
