import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository, ProductRepository } from '../../repositories';

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, ProductRepository],
})
export class BrandModule {}
