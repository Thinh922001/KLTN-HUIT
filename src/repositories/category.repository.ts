import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CateEntity } from '../entities';

@Injectable()
export class CateRepository extends Repository<CateEntity> {
  constructor(private dataSource: DataSource) {
    super(CateEntity, dataSource.createEntityManager());
  }
}
