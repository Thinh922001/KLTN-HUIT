import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository } from '../../repositories';

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
})
export class BrandModule {}
