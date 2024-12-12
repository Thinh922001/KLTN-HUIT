import { Module } from '@nestjs/common';
import { CateBannerRepository } from '../../repositories';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { BannerCateController } from './banner-cate.controller';
import { BannerCateService } from './banner-cate.service';

@Module({
  providers: [BannerCateService, CateBannerRepository],
  controllers: [BannerCateController],
  imports: [CloudinaryModule],
})
export class BannerCateModule {}
