import { Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';
import { ProductDetailsRepository, ProductRepository } from '../../repositories';

@Module({
  controllers: [ProductDetailController],
  providers: [ProductDetailService, ProductDetailsRepository, ProductRepository],
})
export class ProductDetailModule {}
