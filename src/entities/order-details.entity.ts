import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductDetailsEntity } from './product-details.entity';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('order_details')
export class OrderDetailEntity extends AbstractEntity {
  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_price: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: OrderEntity;

  @ManyToOne(() => ProductDetailsEntity, (pro_details) => pro_details.orderDetails, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'product_detail_id', referencedColumnName: 'id' })
  sku: ProductDetailsEntity;
}
