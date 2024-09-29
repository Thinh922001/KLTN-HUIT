import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DistrictService } from './district.service';
import { BaseController } from '../../vendors/base/base-comtroller';

@Controller('district')
export class DistrictController extends BaseController {
  constructor(private readonly districtService: DistrictService) {
    super();
  }

  @Get(':id')
  async getDistrict(@Param('id', ParseIntPipe) id: number) {
    const data = await this.districtService.getDistricts(id);
    return this.response(data);
  }
}
