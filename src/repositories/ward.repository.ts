import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { WardEntity } from '../entities/ward.entity';

@Injectable()
export class WardRepository extends Repository<WardEntity> {
  constructor(private dataSource: DataSource) {
    super(WardEntity, dataSource.createEntityManager());
  }
}
