import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CouponEntity } from '../entities';

@Injectable()
export class CouponRepository extends Repository<CouponEntity> {
  constructor(private dataSource: DataSource) {
    super(CouponEntity, dataSource.createEntityManager());
  }
}
