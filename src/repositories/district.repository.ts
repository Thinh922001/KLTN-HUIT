import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DistrictEntity } from '../entities/district.entity';

@Injectable()
export class DistrictRepository extends Repository<DistrictEntity> {
  constructor(private dataSource: DataSource) {
    super(DistrictEntity, dataSource.createEntityManager());
  }
}
