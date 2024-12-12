import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { CateEntity } from './category.entity';

@Entity('category_banner')
export class CateBannerEntity extends AbstractEntity {
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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'public_id',
  })
  publicId: string;

  @ManyToOne(() => CateEntity, (cate) => cate.cateBanners, { eager: true, nullable: false })
  @JoinColumn({ name: 'cate_id', referencedColumnName: 'id' })
  cate: CateEntity;
}
