import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BannerEntity } from '../entities';

@Injectable()
export class Bannerpository extends Repository<BannerEntity> {
  constructor(private dataSource: DataSource) {
    super(BannerEntity, dataSource.createEntityManager());
  }
}
