import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ProductService } from '../product/product.service';
import {
  BrandRepository,
  CateRepository,
  ProductDetailsRepository,
  ProductImgRepository,
  ProductRepository,
} from '../../repositories';
import { ProductDetailService } from '../product-detail/product-detail.service';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    ProductService,
    ProductRepository,
    CateRepository,
    BrandRepository,
    ProductDetailService,
    ProductDetailsRepository,
    ProductImgRepository,
  ],
})
export class CategoryModule {}
