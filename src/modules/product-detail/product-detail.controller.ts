import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { ProductDetailService } from './product-detail.service';
import { GetDetailProduct } from './dto/get-detail-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GenSkuDto } from './dto/gen-sku.dto';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';

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
  async createProductDetail(@Query() params: GenSkuDto) {
    //  await this.productDetailService.generateSPU(params.productId);
    return this.response([]);
  }

  @Post('upload')
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(FilesInterceptor('img'))
  async uploadImg(@UploadedFiles() files: Express.Multer.File[], @Body('productIdDetail') productIdDetail: number) {
    const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'KLTN/product-details'));
    const uploadResults = await Promise.all(uploadPromises);
    const result = await this.productDetailService.addImgProductDetail(productIdDetail, uploadResults);
    return this.response(result);
  }
}
