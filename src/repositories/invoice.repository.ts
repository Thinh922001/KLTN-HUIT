import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InvoiceEntity } from '../entities';

@Injectable()
export class InvoiceRepository extends Repository<InvoiceEntity> {
  constructor(private dataSource: DataSource) {
    super(InvoiceEntity, dataSource.createEntityManager());
  }
}
