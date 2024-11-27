import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { ProductsEntity } from './products.entity';

@Entity('categories')
export class CateEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'img',
  })
  img: string;

  @OneToMany(() => ProductsEntity, (products) => products.cate)
  products: ProductsEntity[];
}
