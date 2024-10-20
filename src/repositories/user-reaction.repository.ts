import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserReactionEntity } from '../entities';

@Injectable()
export class UserReactionRepository extends Repository<UserReactionEntity> {
  constructor(private dataSource: DataSource) {
    super(UserReactionEntity, dataSource.createEntityManager());
  }
}
