import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ProductService } from '../product/product.service';
import { ProductRepository } from '../../repositories';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, ProductService, ProductRepository],
})
export class CategoryModule {}
