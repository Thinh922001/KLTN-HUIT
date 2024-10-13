import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LabelEntity } from '../entities';

@Injectable()
export class LabelRepository extends Repository<LabelEntity> {
  constructor(private dataSource: DataSource) {
    super(LabelEntity, dataSource.createEntityManager());
  }
}
