import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductDetailsImgEntity } from '../entities';

@Injectable()
export class ProductImgRepository extends Repository<ProductDetailsImgEntity> {
  constructor(private dataSource: DataSource) {
    super(ProductDetailsImgEntity, dataSource.createEntityManager());
  }
}
