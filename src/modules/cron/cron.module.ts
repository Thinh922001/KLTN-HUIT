import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { CronService } from './cron.service';
import { MailService } from '../mail/mail.service';
import { StatisticService } from '../statistic/statistic.service';
import { AdminRepository } from '../../repositories/admin.repository';
import { InvoiceRepository } from '../../repositories';

@Module({
  providers: [CronService, MailService, StatisticService, AdminRepository, InvoiceRepository],
  imports: [ProductModule],
})
export class CronModule {}
