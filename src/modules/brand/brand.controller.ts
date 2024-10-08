import { Body, Controller, Get } from '@nestjs/common';
import { GetBrandByCateDto } from './dto/get-brand-cate.dto';
import { BrandService } from './brand.service';
import { BaseController } from '../../vendors/base/base-comtroller';

@Controller('brand')
export class BrandController extends BaseController {
  constructor(private readonly brandService: BrandService) {
    super();
  }
  @Get()
  async getBrandByCate(@Body() params: GetBrandByCateDto) {
    const data = await this.brandService.getBrandByCate(params);
    return this.response(data);
  }
}
