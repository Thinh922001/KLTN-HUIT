import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WardService } from './ward.service';
import { FindOneParams } from './dto/ward.dto';
import { BaseController } from '../../vendors/base/base-comtroller';

@Controller('ward')
export class WardController extends BaseController {
  constructor(private readonly wardService: WardService) {
    super();
  }

  @Get(':id')
  async getWards(@Param('id', ParseIntPipe) id: number) {
    const data = await this.wardService.getWardService(id);
    return this.response(data);
  }
}
