import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { ProductService } from '../product/product.service';
import { GetCateDto } from './dto/cate.dto';
import { CategoryService } from './category.service';
import { CreateCateDto } from './dto/create-cate.dto';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { UpdateCateDto } from './dto/update-cate.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetAllCateDto } from './dto/get-all-cate.dto';

@Controller()
export class CategoryController extends BaseController {
  constructor(
    private readonly productService: ProductService,
    private readonly cateService: CategoryService,
    private readonly cloudinaryService: CloudinaryService
  ) {
    super();
  }

  @Get('user/category')
  async getAllCateUser() {
    const data = await this.cateService.getAllCateUser();
    return this.response(data);
  }

  @Get('category')
  async getCategory(@Query() query: GetCateDto) {
    const data = await this.productService.getProductByCate(query);
    return this.response(data);
  }

  @Post('category')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async createCate(@Body() body: CreateCateDto) {
    const data = await this.cateService.createCate(body);
    return this.response(data);
  }

  @Post('category/upload')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('img'))
  async uploadImgCate(@UploadedFile() file: Express.Multer.File, @Body('cateId') cateId: number) {
    if (!cateId) throw new BadRequestException('cateId is not null');
    const cate = await this.cateService.getCateById(cateId);
    await this.cloudinaryService.deleteImage(`KLTN/cate/${cateId}`);
    const uploadResults = await this.cloudinaryService.uploadImage(file, 'KLTN/cate', String(cateId));
    const result = await this.cateService.updateCateUser(cate.id, { img: uploadResults.url });
    return this.response(result);
  }

  @Get('admin/category')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getAllCate(@Query() body: GetAllCateDto) {
    const data = await this.cateService.getAllCate(body);
    return this.response(data);
  }

  @Put('admin/category')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async updateCate(@Body() body: UpdateCateDto) {
    const data = await this.cateService.updateCate(body);
    return this.response([]);
  }

  @Delete('admin/category/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async deleteCate(@Param('id') cateId: number) {
    const data = await this.cateService.deleteCate(cateId);
    return this.response([]);
  }
}
