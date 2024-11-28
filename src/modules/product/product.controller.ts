import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseController } from '../../vendors/base/base-controller';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { UpdateProduct } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@Controller('product')
export class ProductController extends BaseController {
  constructor(private readonly productService: ProductService, private readonly cloudinaryService: CloudinaryService) {
    super();
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getProduct(@Query() params: GetProductDto) {
    const data = await this.productService.getProduct(params);
    return this.response(data);
  }

  @Get('/random')
  async getRandomProduct() {
    const data = await this.productService.getRandomProduct();
    return this.response(data);
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getProductById(@Param('id') productId: number) {
    const data = await this.productService.getProductByIdAdm(productId);
    return this.response(data);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async createProduct(@Body() body: CreateProductDto) {
    const data = await this.productService.createProduct(body);
    return this.response(data);
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async updateProduct(@Param('id') productId: number, @Body() body: UpdateProduct) {
    const data = await this.productService.updateProductAdmin(productId, body);
    return this.response(data);
  }

  @Post('upload')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  async uploadImgProduct(@UploadedFile() file: Express.Multer.File, @Body('productId') productId: number) {
    if (!productId) throw new BadRequestException('productId is not null');
    const product = await this.productService.getProductById(productId);
    const uploadResults = await this.cloudinaryService.uploadImage(file, 'KLTN/products', String(product.id));
    const result = await this.productService.updateProduct(product.id, { img: uploadResults.url });
    return this.response(result);
  }

  @Post('upload/change')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  async changeProductImg(@UploadedFile() file: Express.Multer.File, @Body('productId') productId: number) {
    if (!productId) throw new BadRequestException('productId is not null');
    const product = await this.productService.getProductById(productId);
    // delete product img from cloud
    await this.cloudinaryService.deleteImage(`KLTN/products/${productId}`);
    const uploadResults = await this.cloudinaryService.uploadImage(file, 'KLTN/products', String(product.id));
    const result = await this.productService.updateProduct(product.id, { img: uploadResults.url });
    return this.response(result);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async deleteProduct(@Param('id') productId: number) {
    const data = await this.productService.deleteProduct(productId);
    return this.response([]);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async undoDeleteProduct(@Param('id') productId: number) {
    const data = await this.productService.undoDeleteProduct(productId);
    return this.response([]);
  }
}
