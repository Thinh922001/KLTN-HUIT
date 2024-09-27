import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { IItemInfo } from '../common/constaints';
import { BrandsEntity } from './brand.entity';
import { CategoriesEntity } from './category.entity';
import { ItemsTypeEntity } from './item-type.entity';

@Entity('items')
export class ItemsEntity extends AbstractEntity {
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @IsNotEmpty({ message: 'Name can not be null or empty' })
  @Column({ type: 'varchar', nullable: false, length: 255, default: false, name: 'name' })
  name: string;

  @IsNotEmpty({ message: 'Image can not be null or empty' })
  @Column({ type: 'varchar', nullable: true, length: 255, default: null, name: 'image' })
  image: string;

  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @IsNotEmpty({ message: 'Info can not be null or empty' })
  @Column({ type: 'simple-json', nullable: false, default: null, name: 'info' })
  info: IItemInfo;

  @Column({ type: 'boolean', nullable: false, default: true, name: 'status' })
  status: boolean;

  @Column({ type: 'mediumtext', nullable: true, default: null, name: 'description' })
  description: string;

  /*
  trans  VN : Thành Phần
  */
  @Column({ type: 'mediumtext', nullable: true, default: null, name: 'ingredient' })
  ingredient: string;

  /*
  trans VN : Hướng dẫn sử dụng
  */
  @Column({ type: 'mediumtext', nullable: true, default: null, name: 'user_guide' })
  userGuide: string;

  /*
  trans VN : bảo quản
  */
  @Column({ type: 'mediumtext', nullable: true, default: null, name: 'preserve' })
  preserve: string;

  @Column({ type: 'bigint', nullable: true, default: 0, name: 'cost' })
  cost: number;

  @ManyToOne(() => BrandsEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'brand_id', referencedColumnName: 'id' })
  brand: BrandsEntity;

  @ManyToOne(() => CategoriesEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  Category: CategoriesEntity;

  @ManyToOne(() => ItemsTypeEntity, { onDelete: 'RESTRICT', onUpdate: 'CASCADE', eager: true, nullable: false })
  @JoinColumn({ name: 'item_type_id', referencedColumnName: 'id' })
  ItemsType: ItemsTypeEntity;
}
