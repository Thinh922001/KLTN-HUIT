import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CartItemEntity } from '../entities';

@Injectable()
export class CartItemsRepository extends Repository<CartItemEntity> {
  constructor(private dataSource: DataSource) {
    super(CartItemEntity, dataSource.createEntityManager());
  }
}
