import { Controller } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-comtroller';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }
}
