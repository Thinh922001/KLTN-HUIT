import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { ProductService } from '../product/product.service';
import { GetCateDto } from './dto/cate.dto';
import { CategoryService } from './category.service';
import { CreateCateDto } from './dto/create-cate.dto';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { UpdateCateDto } from './dto/update-cate.dto';

@Controller()
export class CategoryController extends BaseController {
  constructor(private readonly productService: ProductService, private readonly cateService: CategoryService) {
    super();
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

  @Get('admin/category')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getAllCate() {
    const data = await this.cateService.getAllCate();
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
