import { Module } from '@nestjs/common';
import { ReturnOrderService } from './return-order.service';
import { ReturnOrderController } from './return-order.controller';
import {
  InvoiceRepository,
  OrderDetailRepository,
  OrderRepository,
  ProductDetailsRepository,
  ReturnOrderImgRepository,
  ReturnOrderRepository,
} from '../../repositories';
import { WalletsRepository } from '../../repositories/wallets.repository';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  providers: [
    ReturnOrderService,
    ReturnOrderRepository,
    OrderRepository,
    ProductDetailsRepository,
    WalletsRepository,
    InvoiceRepository,
    OrderDetailRepository,
    ReturnOrderImgRepository,
  ],
  controllers: [ReturnOrderController],
  imports: [CloudinaryModule],
})
export class ReturnOrderModule {}
