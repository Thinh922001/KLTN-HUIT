import { Module } from '@nestjs/common';
import { OrderRepository } from '../../repositories';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';

@Module({
  controllers: [OrderDetailController],
  providers: [OrderDetailService, OrderRepository],
})
export class OrderDetailModule {}
