import { Module } from '@nestjs/common';
import { OrderDetailRepository, OrderRepository } from '../../repositories';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';

@Module({
  controllers: [OrderDetailController],
  providers: [OrderDetailService, OrderRepository, OrderDetailRepository],
})
export class OrderDetailModule {}
