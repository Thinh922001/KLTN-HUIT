import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { LabelEntity } from './label.entity';
import { ProductsEntity } from './products.entity';

@Entity('label_product')
export class LabelProductEntity extends AbstractEntity {
  @ManyToOne(() => LabelEntity, (label) => label.labelProducts, { eager: true, nullable: false })
  @JoinColumn({ name: 'label_id', referencedColumnName: 'id' })
  label: LabelEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.labelProducts, { eager: true, nullable: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductsEntity;
}
