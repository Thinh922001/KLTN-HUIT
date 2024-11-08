import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { OrderDetailEntity } from '../entities';

@Injectable()
export class OrderDetailRepository extends Repository<OrderDetailEntity> {
  constructor(private dataSource: DataSource) {
    super(OrderDetailEntity, dataSource.createEntityManager());
  }
}
