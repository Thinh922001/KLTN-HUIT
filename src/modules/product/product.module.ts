import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
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
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { LabelsService } from '../labels/labels.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    BrandRepository,
    CateRepository,
    ProductDetailsRepository,
    ProductDetailService,
    ProductImgRepository,
    LabelsService,
    LabelRepository,
    LabelProductRepository,
  ],
  imports: [CloudinaryModule],
  exports: [ProductService],
})
export class ProductModule {}
