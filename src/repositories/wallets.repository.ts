import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { WardEntity } from '../entities/ward.entity';
import { WalletsEntity } from '../entities/wallets.entity';

@Injectable()
export class WalletsRepository extends Repository<WalletsEntity> {
  constructor(private dataSource: DataSource) {
    super(WalletsEntity, dataSource.createEntityManager());
  }
}
