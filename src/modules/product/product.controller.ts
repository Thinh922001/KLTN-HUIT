import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-comtroller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('product')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService, private readonly cloudinaryService: CloudinaryService) {
    super();
  }

  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    const data = await this.productService.createProduct(body);
    return this.response(data);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('img'))
  async uploadImgProduct(@UploadedFile() file: Express.Multer.File, @Body('productId') productId: number) {
    if (!productId) throw new Error('productId is not null');
    const product = await this.productService.getProductById(productId);
    const uploadResults = await this.cloudinaryService.uploadImage(file, 'KLTN/products', String(product.id));
    const result = await this.productService.updateProduct(product.id, { img: uploadResults.url });
    return this.response(result);
  }
}
