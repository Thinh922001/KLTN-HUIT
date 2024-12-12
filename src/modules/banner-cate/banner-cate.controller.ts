import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { BannerCateService } from './banner-cate.service';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('banner-cate')
export class BannerCateController extends BaseController {
  constructor(
    private readonly cateBannerService: BannerCateService,
    private readonly cloudinaryService: CloudinaryService
  ) {
    super();
  }

  @Get()
  async getBannerCate() {
    const data = await this.cateBannerService.getCateBanner();
    return this.response(data);
  }

  @Get('/admin')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getBannerCateAdmin() {
    const data = await this.cateBannerService.getCateBannerAdmin();
    return this.response(data);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FilesInterceptor('img'))
  async createBanner(@UploadedFiles() files: Express.Multer.File[], @Body('cateId') cateId: number) {
    if (!files.length || cateId === null || undefined) throw new BadRequestException('Invalid input');
    const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'KLTN/cate-banner'));
    const uploadResults = await Promise.all(uploadPromises);
    await this.cateBannerService.createBanner(cateId, uploadResults);
    return this.response([]);
  }

  @Delete()
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async deleteBanner(@Body() body: { cateBannerId: number[] }) {
    if (!body.cateBannerId.length) throw new BadRequestException('BannerId cannot be null');
    const publicIds = await this.cateBannerService.getPublicId(body.cateBannerId);
    const delImgPromises = publicIds.map((e) => this.cloudinaryService.deleteImage(e));
    await Promise.all(delImgPromises);
    await this.cateBannerService.deleteBanner(body.cateBannerId);
    return this.response([]);
  }
}
