import { Body, Controller, Get } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { BaseController } from '../../vendors/base/base-comtroller';

@Controller('province')
export class ProvinceController extends BaseController {
  constructor(private readonly provinceService: ProvinceService) {
    super();
  }

  @Get()
  async getProvince() {
    const data = await this.provinceService.getProvince();
    return this.response(data);
  }
}
