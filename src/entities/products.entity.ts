import { Entity, Column, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AbstractProduct } from '../vendors/base/abtract-product.entity';
import { LabelProductEntity } from './label-product.entity';
import { BrandEntity } from './brand.entity';
import { CateEntity } from './category.entity';
import { Variant } from '../vendors/base/type';
import { ProductDetailsEntity } from './product-details.entity';
import { GiftEntity } from './gift.entity';

@Entity('products')
export class ProductsEntity extends AbstractProduct {
  @Index()
  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: false,
    name: 'product_name',
  })
  ProductName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'img',
  })
  img: string;

  @Column({
    type: 'simple-array',
    nullable: true,
    name: 'text_online_type',
  })
  textOnlineType: number;

  @Column({
    type: 'simple-array',
    nullable: true,
    name: 'tabs',
  })
  tabs: string[];

  @Column({
    type: 'json',
    nullable: true,
    name: 'variants',
  })
  variants: Variant[];

  @Column({
    type: 'int',
    default: 0,
    unsigned: true,
    name: 'total_vote',
  })
  totalVote: number;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    default: 0,
    unsigned: true,
    name: 'start_rate',
  })
  starRate: number;

  @OneToMany(() => LabelProductEntity, (labelProduct) => labelProduct.product)
  labelProducts: LabelProductEntity[];

  @ManyToOne(() => BrandEntity, (brand) => brand.products, { eager: true, nullable: false })
  @JoinColumn({ name: 'brand_id', referencedColumnName: 'id' })
  brand: BrandEntity;

  @ManyToOne(() => CateEntity, (cate) => cate.products, { eager: true, nullable: false })
  @JoinColumn({ name: 'cate_id', referencedColumnName: 'id' })
  cate: CateEntity;

  @OneToMany(() => ProductDetailsEntity, (productDetails) => productDetails.product)
  productDetails: ProductDetailsEntity[];

  @OneToMany(() => GiftEntity, (gift) => gift.spu)
  gifts: GiftEntity[];
}
