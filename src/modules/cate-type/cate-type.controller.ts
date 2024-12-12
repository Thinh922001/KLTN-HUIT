import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { CateTypeService } from './cate-type.service';
import { CreateCateTypeDto, UpdateCateTypeDto } from './dto/creae-cate-type.dto';

@Controller('cate-type')
export class CateTypeController extends BaseController {
  constructor(private readonly cateTypeService: CateTypeService) {
    super();
  }

  @Get()
  async getCateType() {
    const data = await this.cateTypeService.getCateTypeUser();
    return this.response(data);
  }

  @Get('/admin')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getCateTypeAdmin() {
    const data = await this.cateTypeService.getCateTypeAdmin();
    return this.response(data);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async createCateType(@Body() body: CreateCateTypeDto) {
    const data = await this.cateTypeService.createCateType(body);
    return this.response(data);
  }

  @Put()
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async updateCateType(@Body() body: UpdateCateTypeDto) {
    const data = await this.cateTypeService.updateCateType(body);
    return this.response([]);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async deleteCateType(@Param('id') cateTypeId: number) {
    const data = await this.cateTypeService.deleteCateType(cateTypeId);
    return this.response(data);
  }
}
