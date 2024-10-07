import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductsEntity } from '../entities';

@Injectable()
export class ProductRepository extends Repository<ProductsEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductsEntity, dataSource.createEntityManager());
  }
}
