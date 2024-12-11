import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserTransactionEntity } from '../entities/user-transaction.entity';
import { WardEntity } from '../entities/ward.entity';

@Injectable()
export class UserTransactionRepository extends Repository<UserTransactionEntity> {
  constructor(private dataSource: DataSource) {
    super(UserTransactionEntity, dataSource.createEntityManager());
  }
}
