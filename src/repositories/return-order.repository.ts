import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReturnOrderEntity } from '../entities';

@Injectable()
export class ReturnOrderRepository extends Repository<ReturnOrderEntity> {
  constructor(private dataSource: DataSource) {
    super(ReturnOrderEntity, dataSource.createEntityManager());
  }
}
