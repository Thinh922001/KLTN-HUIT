import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { ProductDetailService } from './product-detail.service';
import { GetDetailProduct } from './dto/get-detail-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GenSkuDto } from './dto/gen-sku.dto';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { DeleteImgDto } from './dto/delete-img-product-detail.dto';
import { UpdateProductDetail } from './dto/update-product-detail.dto';

@Controller()
export class ProductDetailController extends BaseController {
  constructor(
    private readonly productDetailService: ProductDetailService,
    private readonly cloudinaryService: CloudinaryService
  ) {
    super();
  }

  @Get('product-detail')
  async getDetailProduct(@Query() params: GetDetailProduct) {
    const data = await this.productDetailService.getDetailProduct(params);
    return this.response(data);
  }

  @Get('admin/product-detail/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getProductDetailAdmin(@Param('id') productDetailId: number) {
    const data = await this.productDetailService.getProductDetail(productDetailId);
    return this.response(data);
  }

  @Get('product-detail/variant')
  async getProductDetailVariant(@Query() params: GetDetailProduct) {
    const data = await this.productDetailService.getProductDetailFromVariant(params);
    return this.response(data);
  }

  @Get('product-detail/create')
  async createProductDetail(@Query() params: GenSkuDto) {
    //  await this.productDetailService.generateSPU(params.productId);
    return this.response([]);
  }

  @Post('product-detail/upload')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FilesInterceptor('img'))
  async uploadImg(@UploadedFiles() files: Express.Multer.File[], @Body('productIdDetail') productIdDetail: number) {
    const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'KLTN/product-details'));
    const uploadResults = await Promise.all(uploadPromises);
    const result = await this.productDetailService.addImgProductDetail(productIdDetail, uploadResults);
    return this.response(result);
  }

  @Delete('product-detail/upload')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async deleteImgProductDetail(@Body() body: DeleteImgDto) {
    if (!body.delImgId.length) return this.response([]);
    const publicIds = await this.productDetailService.getPublicIdFromProductImgDetail(body.delImgId);
    if (!publicIds.length) return this.response([]);
    const delImgPromises = publicIds.map((e) => this.cloudinaryService.deleteImage(e));
    await Promise.all(delImgPromises);
    await this.productDetailService.deleteImgId(body.delImgId);
    return this.response([]);
  }

  @Put('product-detail/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async updateProductDetail(@Param('id') productDetailId: number, @Body() body: UpdateProductDetail) {
    const data = await this.productDetailService.updateProductDetail(productDetailId, body);
    return this.response(data);
  }

  @Delete('product-detail/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async deleteProductDetail(@Param('id') productDetailId: number) {
    const data = await this.productDetailService.deleteProductDetail(productDetailId);
    return this.response([]);
  }

  @Patch('product-detail/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async restoreProductDetail(@Param('id') productDetailId: number) {
    const data = await this.productDetailService.restoreProductDetail(productDetailId);
    return this.response([]);
  }
}
