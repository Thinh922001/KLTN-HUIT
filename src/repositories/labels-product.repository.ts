import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LabelProductEntity } from '../entities';

@Injectable()
export class LabelProductRepository extends Repository<LabelProductEntity> {
  constructor(private dataSource: DataSource) {
    super(LabelProductEntity, dataSource.createEntityManager());
  }
}
