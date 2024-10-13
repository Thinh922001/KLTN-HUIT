import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {
  BrandRepository,
  CateRepository,
  ProductDetailsRepository,
  ProductImgRepository,
  ProductRepository,
} from '../../repositories';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

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
  ],
  imports: [CloudinaryModule],
})
export class ProductModule {}
