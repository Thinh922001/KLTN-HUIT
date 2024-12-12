import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CateBannerEntity } from '../entities';

@Injectable()
export class CateBannerRepository extends Repository<CateBannerEntity> {
  constructor(private dataSource: DataSource) {
    super(CateBannerEntity, dataSource.createEntityManager());
  }
}
