import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { CategoryTypeEntity } from './category-type.entity';
import { CateBannerEntity } from './category-banner.entity';
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

  @ManyToOne(() => CategoryTypeEntity, (cate_type) => cate_type.category, { eager: true, nullable: true })
  @JoinColumn({ name: 'cate_type_id', referencedColumnName: 'id' })
  cateType: CategoryTypeEntity;

  @OneToMany(() => CateBannerEntity, (cate_banner) => cate_banner.cate)
  cateBanners: CateBannerEntity[];

  @OneToMany(() => ProductsEntity, (product) => product.cate)
  products: ProductsEntity[];
}
