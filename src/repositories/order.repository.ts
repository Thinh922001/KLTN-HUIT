import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../entities';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(private dataSource: DataSource) {
    super(OrderEntity, dataSource.createEntityManager());
  }
}
