import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { InvoiceRepository } from '../../repositories';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService, InvoiceRepository],
})
export class StatisticModule {}
