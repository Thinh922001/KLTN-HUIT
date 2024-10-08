import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BrandEntity } from '../entities';

@Injectable()
export class BrandRepository extends Repository<BrandEntity> {
  constructor(private dataSource: DataSource) {
    super(BrandEntity, dataSource.createEntityManager());
  }
}
