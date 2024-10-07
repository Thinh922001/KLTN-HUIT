import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('gift')
export class GiftEntity extends AbstractEntity {
  @Column({ type: 'varchar', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', length: 255 })
  gift_name: string;

  @Column({ type: 'text', charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @ManyToOne(() => ProductsEntity, (product) => product.gifts, { eager: true, nullable: false })
  @JoinColumn({ name: 'sku_id', referencedColumnName: 'id' })
  spu: ProductsEntity;
}
