import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetBrandByCateDto } from './dto/get-brand-cate.dto';
import { BrandService } from './brand.service';
import { BaseController } from '../../vendors/base/base-comtroller';
import { CreateBrandDto } from './dto/create-brand.dto';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';

@Controller('brand')
export class BrandController extends BaseController {
  constructor(private readonly brandService: BrandService) {
    super();
  }
  @Get()
  async getBrandByCate(@Query() params: GetBrandByCateDto) {
    const data = await this.brandService.getBrandByCate(params);
    return this.response(data);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  async createBrand(@Body() body: CreateBrandDto) {
    const data = await this.brandService.createBrand(body);
    return this.response(data);
  }
}
