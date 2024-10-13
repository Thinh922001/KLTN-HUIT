import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-comtroller';
import { ProductService } from '../product/product.service';
import { GetCateDto } from './dto/cate.dto';
import { CategoryService } from './category.service';
import { CreateCateDto } from './dto/create-cate.dto';

@Controller('category')
export class CategoryController extends BaseController {
  constructor(private readonly productService: ProductService, private readonly cateService: CategoryService) {
    super();
  }

  @Get()
  async getCategory(@Query() query: GetCateDto) {
    const data = await this.productService.getProductByCate(query);
    return this.response(data);
  }

  @Post()
  async createCate(@Body() body: CreateCateDto) {
    const data = await this.cateService.createCate(body);
    return this.response(data);
  }
}
