import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WardService } from './ward.service';
import { FindOneParams } from './dto/ward.dto';

@Controller('ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get(':id')
  async getWards(@Param('id', ParseIntPipe) id: number) {
    return await this.wardService.getWardService(id);
  }
}
