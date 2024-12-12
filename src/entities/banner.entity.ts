import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('banner')
export class BannerEntity extends AbstractEntity {
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
}
