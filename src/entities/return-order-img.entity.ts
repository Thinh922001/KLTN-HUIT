import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ReturnOrderEntity } from '.';
import { AbstractEntity } from '../vendors/base/abtract.entity';

@Entity('return_order_img')
export class ReturnOrderImgEntity extends AbstractEntity {
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

  @ManyToOne(() => ReturnOrderEntity, (return_order) => return_order.returnOrderImg, { eager: true, nullable: false })
  @JoinColumn({ name: 'return_order_id', referencedColumnName: 'id' })
  returnOrder: ReturnOrderEntity;
}
