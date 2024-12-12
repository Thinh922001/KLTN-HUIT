import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CategoryTypeEntity } from '../entities';

@Injectable()
export class CateTypeRepository extends Repository<CategoryTypeEntity> {
  constructor(private dataSource: DataSource) {
    super(CategoryTypeEntity, dataSource.createEntityManager());
  }
}
