import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abtract.entity';
import { OrderEntity } from './order.entity';
import { InvoiceEntity } from './invoice.entity';
import { CartEntity } from './cart.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  phone: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    nullable: false,
  })
  name: string;

  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email can not be null or empty' })
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Exclude()
  @IsNotEmpty({ message: 'Password can not be null or empty' })
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'mediumtext', nullable: true })
  refreshToken: string;

  @MaxLength(500, { message: 'The length must be less than 500 characters' })
  @Column({ type: 'varchar', length: 500, nullable: true, charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  address: string | null;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders: OrderEntity[];

  @OneToMany(() => InvoiceEntity, (order) => order.customer)
  invoices: OrderEntity[];

  @OneToOne(() => CartEntity, (cart) => cart.customer)
  cart: CartEntity;
}
