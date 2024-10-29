import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CartEntity } from '../entities';

@Injectable()
export class CartRepository extends Repository<CartEntity> {
  constructor(private dataSource: DataSource) {
    super(CartEntity, dataSource.createEntityManager());
  }
}
