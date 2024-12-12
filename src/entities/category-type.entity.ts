import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { CateEntity } from './category.entity';

@Entity('category_type')
export class CategoryTypeEntity extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: false,
  })
  name: string;

  @OneToMany(() => CateEntity, (cate) => cate.cateType)
  category: CateEntity[];
}
