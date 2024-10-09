import { Controller, Get, Query } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-comtroller';
import { ProductDetailService } from './product-detail.service';
import { GetDetailProduct } from './dto/get-detail-product.dto';

@Controller('product-detail')
export class ProductDetailController extends BaseController {
  constructor(private readonly productDetailService: ProductDetailService) {
    super();
  }

  @Get()
  async getDetailProduct(@Query() params: GetDetailProduct) {
    return this.response([]);
  }
}
