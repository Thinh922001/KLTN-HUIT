import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-comtroller';
import { ProductService } from '../product/product.service';
import { GetCateDto } from './dto/cate.dto';

@Controller('category')
export class CategoryController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @Get()
  async getCategory(@Query() query: GetCateDto) {
    const data = await this.productService.getProductByCate(query);
    return this.response(data);
  }
}
