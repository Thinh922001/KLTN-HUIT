import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractProduct } from '../vendors/base/abtract-product.entity';
import { ProductsEntity } from './products.entity';
import { ProductDetailsImgEntity } from './product-details-img.entity';
import { OrderDetailEntity } from './order-details.entity';
import { CartItemEntity } from './cart-items.entity';

@Entity('product_details')
export class ProductDetailsEntity extends AbstractProduct {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  sku_code: string;

  @Column({
    type: 'json',
    nullable: true,
    name: ' variation_details',
  })
  variationDetails: Record<string | number, string | number>;

  @Column({
    type: 'int',
    default: 0,
    unsigned: true,
    name: 'stock',
  })
  stock: number;

  @ManyToOne(() => ProductsEntity, (product) => product.productDetails, { eager: true, nullable: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductsEntity;

  @OneToMany(() => ProductDetailsImgEntity, (productDetailsImg) => productDetailsImg.productDetails)
  productDetailsImg: ProductDetailsImgEntity[];

  @OneToMany(() => OrderDetailEntity, (order_details) => order_details.sku)
  orderDetails: OrderDetailEntity[];

  @OneToMany(() => CartItemEntity, (cart_items) => cart_items.sku)
  cartItems: CartItemEntity[];
}
