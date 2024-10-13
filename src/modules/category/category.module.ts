import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ProductService } from '../product/product.service';
import {
  BrandRepository,
  CateRepository,
  LabelProductRepository,
  LabelRepository,
  ProductDetailsRepository,
  ProductImgRepository,
  ProductRepository,
} from '../../repositories';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { LabelsService } from '../labels/labels.service';

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
    LabelsService,
    LabelRepository,
    LabelProductRepository,
  ],
})
export class CategoryModule {}
