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
import { FilesInterceptor } from '@nestjs/platform-express';
import { BaseController } from '../../vendors/base/base-controller';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController extends BaseController {
  constructor(private readonly cloudinaryService: CloudinaryService, private readonly bannerService: BannerService) {
    super();
  }

  @Get()
  async getAllBannerClient() {
    const data = await this.bannerService.getAllBanner();
    return this.response(data);
  }

  @Get('/admin')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getAllBannerAdmin() {
    const data = await this.bannerService.getAllBannerAdmin();
    return this.response(data);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FilesInterceptor('img'))
  async createBanner(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadPromises = files.map((file) => this.cloudinaryService.uploadImage(file, 'KLTN/banner'));
    const uploadResults = await Promise.all(uploadPromises);
    await this.bannerService.createBanner(uploadResults);
  }

  @Delete()
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async deleteBanner(@Body() body: { bannerId: number[] }) {
    if (!body.bannerId.length) throw new BadRequestException('BannerId cannot be null');
    const publicIds = await this.bannerService.getPublicId(body.bannerId);
    const delImgPromises = publicIds.map((e) => this.cloudinaryService.deleteImage(e));
    await Promise.all(delImgPromises);
    return this.response([]);
  }
}
