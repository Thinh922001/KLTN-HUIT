import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { CronService } from './cron.service';
import { MailService } from '../mail/mail.service';
import { StatisticService } from '../statistic/statistic.service';
import { AdminRepository } from '../../repositories/admin.repository';

@Module({
  providers: [CronService, MailService, StatisticService, AdminRepository],
  imports: [ProductModule],
})
export class CronModule {}
