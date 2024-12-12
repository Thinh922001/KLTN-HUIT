import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { Bannerpository } from '../../repositories';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  providers: [BannerService, Bannerpository],
  controllers: [BannerController],
  imports: [CloudinaryModule],
})
export class BannerModule {}
