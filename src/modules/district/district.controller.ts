import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get(':id')
  async getDistrict(@Param('id', ParseIntPipe) id: number) {
    return await this.districtService.getDistricts(id);
  }
}
