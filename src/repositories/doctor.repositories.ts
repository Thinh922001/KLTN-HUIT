import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DoctorsEntity } from '../entities/doctor.entity';

@Injectable()
export class DoctorRepository extends Repository<DoctorsEntity> {
  constructor(private dataSource: DataSource) {
    super(DoctorsEntity, dataSource.createEntityManager());
  }
}