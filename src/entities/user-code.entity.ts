import { Entity, Column, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { getAdjustedTimeWithTimeZone } from '../utils/date';
import { UserEntity } from '.';

@Entity('user_code')
export class UserCodeEntity extends AbstractEntity {
  @Column({
    type: 'int',
    nullable: false,
  })
  code: string;

  @Column({ type: 'datetime', nullable: true })
  expiration_date: Date;

  @OneToOne(() => UserEntity, (user) => user.userCode, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @BeforeInsert()
  @BeforeUpdate()
  updateExpirationDate() {
    this.expiration_date = new Date(getAdjustedTimeWithTimeZone(1, 'minutes')); // 2 minutes
  }
}
