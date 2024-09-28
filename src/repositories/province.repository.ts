import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProvinceEntity } from '../entities/province.entity';

@Injectable()
export class ProvinceRepository extends Repository<ProvinceEntity> {
  constructor(private dataSource: DataSource) {
    super(ProvinceEntity, dataSource.createEntityManager());
  }
}
