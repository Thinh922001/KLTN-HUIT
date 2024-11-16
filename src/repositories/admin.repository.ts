import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdminEntity } from '../entities';

@Injectable()
export class AdminRepository extends Repository<AdminEntity> {
  constructor(private dataSource: DataSource) {
    super(AdminEntity, dataSource.createEntityManager());
  }
}