import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-comtroller';
import { ProductDetailService } from './product-detail.service';
import { GetDetailProduct } from './dto/get-detail-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AddImgDto } from './dto/add-img-prduct-detail.dto';

@Controller('product-detail')
export class ProductDetailController extends BaseController {
  constructor(
    private readonly productDetailService: ProductDetailService,
    private readonly cloudinaryService: CloudinaryService
  ) {
    super();
  }

  @Get()
  async getDetailProduct(@Query() params: GetDetailProduct) {
    const data = await this.productDetailService.getDetailProduct(params);
    return this.response(data);
  }

  @Get('variant')
  async getProductDetailVariant(@Query() params: GetDetailProduct) {
    const data = await this.productDetailService.getProductDetailFromVariant(params);
    return this.response(data);
  }

  @Get('create')
  async createProductDetail() {
    //  await this.productDetailService.generateSPU();
    return this.response([]);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('img'))
  async uploadImg(@UploadedFiles() files: Express.Multer.File[], @Body() body: AddImgDto) {
    const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'KLTN/product-details'));
    const uploadResults = await Promise.all(uploadPromises);
    const result = await this.productDetailService.addImgProductDetail(body, uploadResults);
    return this.response(result);
  }
}
