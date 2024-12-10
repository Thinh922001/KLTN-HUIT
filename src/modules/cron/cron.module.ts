import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { CronService } from './cron.service';

@Module({
  providers: [CronService],
  imports: [ProductModule],
})
export class CronModule {}
