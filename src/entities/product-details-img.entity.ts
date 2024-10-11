import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { ProductDetailsEntity } from './product-details.entity';

@Entity('product_details_img')
export class ProductDetailsImgEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'img',
  })
  img: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'public_id',
  })
  publicId: string;

  @ManyToOne(() => ProductDetailsEntity, (product_details) => product_details.productDetailsImg, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'product_details_id', referencedColumnName: 'id' })
  productDetails: ProductDetailsEntity;
}
