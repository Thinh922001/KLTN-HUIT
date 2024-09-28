import { Module } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { DistrictRepository } from '../../repositories';

@Module({
  controllers: [DistrictController],
  providers: [DistrictService, DistrictRepository],
})
export class DistrictModule {}
