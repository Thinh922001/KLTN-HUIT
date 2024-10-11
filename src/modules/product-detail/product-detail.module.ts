import { Module } from '@nestjs/common';
import { ProductDetailController } from './product-detail.controller';
import { ProductDetailService } from './product-detail.service';
import { ProductDetailsRepository, ProductImgRepository, ProductRepository } from '../../repositories';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [ProductDetailController],
  providers: [ProductDetailService, ProductDetailsRepository, ProductRepository, ProductImgRepository],
  imports: [CloudinaryModule],
})
export class ProductDetailModule {}
