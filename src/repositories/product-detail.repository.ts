import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductDetailsEntity } from '../entities';

@Injectable()
export class ProductDetailsRepository extends Repository<ProductDetailsEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductDetailsEntity, dataSource.createEntityManager());
  }
}
