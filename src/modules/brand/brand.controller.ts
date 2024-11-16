import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { GetBrandByCateDto } from './dto/get-brand-cate.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller()
export class BrandController extends BaseController {
  constructor(private readonly brandService: BrandService) {
    super();
  }
  @Get('brand')
  async getBrandByCate(@Query() params: GetBrandByCateDto) {
    const data = await this.brandService.getBrandByCate(params);
    return this.response(data);
  }

  @Post('admin/brand')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async createBrand(@Body() body: CreateBrandDto) {
    const data = await this.brandService.createBrand(body);
    return this.response(data);
  }

  @Get('admin/brand')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getAllBrand() {
    const data = await this.brandService.getAllBrand();
    return this.response(data);
  }

  @Put('admin/brand')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async update(@Body() body: UpdateBrandDto) {
    const data = await this.brandService.updateBrand(body);
    return this.response([]);
  }

  @Delete('admin/brand/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async delete(@Param('id') brandId: number) {
    const data = await this.brandService.deleteBrand(brandId);
    return this.response([]);
  }
}
