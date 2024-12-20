import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReturnOrderImgEntity } from '../entities';

@Injectable()
export class ReturnOrderImgRepository extends Repository<ReturnOrderImgEntity> {
  constructor(private dataSource: DataSource) {
    super(ReturnOrderImgEntity, dataSource.createEntityManager());
  }
}
