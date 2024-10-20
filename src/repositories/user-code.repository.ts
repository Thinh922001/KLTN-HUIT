import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserCodeEntity } from '../entities';

@Injectable()
export class UserCodeRepository extends Repository<UserCodeEntity> {
  constructor(private dataSource: DataSource) {
    super(UserCodeEntity, dataSource.createEntityManager());
  }
}
