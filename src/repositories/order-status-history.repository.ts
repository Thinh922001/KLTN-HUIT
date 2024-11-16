import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderStatusHistory } from '../entities';

@Injectable()
export class OrderStatusHistoryRepository extends Repository<OrderStatusHistory> {
  constructor(private dataSource: DataSource) {
    super(OrderStatusHistory, dataSource.createEntityManager());
  }
}
