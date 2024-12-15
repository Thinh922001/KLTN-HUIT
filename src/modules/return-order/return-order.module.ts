import { Module } from '@nestjs/common';
import { ReturnOrderService } from './return-order.service';
import { ReturnOrderController } from './return-order.controller';
import {
  InvoiceRepository,
  OrderDetailRepository,
  OrderRepository,
  ProductDetailsRepository,
  ReturnOrderRepository,
} from '../../repositories';
import { WalletsRepository } from '../../repositories/wallets.repository';

@Module({
  providers: [
    ReturnOrderService,
    ReturnOrderRepository,
    OrderRepository,
    ProductDetailsRepository,
    WalletsRepository,
    InvoiceRepository,
    OrderDetailRepository,
  ],
  controllers: [ReturnOrderController],
})
export class ReturnOrderModule {}
