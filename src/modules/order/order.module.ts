import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CouponRepository, InvoiceRepository, ProductDetailsRepository } from '../../repositories';
import { OrderStatusHistoryRepository } from '../../repositories/order-status-history.repository';
import { OrderRepository } from '../../repositories/order.repository';
import { OptionalJwtGuard } from '../auth/strategies/jwt.straegy.optional';
import { CartModule } from '../cart/cart.module';
import { CouponModule } from '../coupon/coupon.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AdminRepository } from '../../repositories/admin.repository';
import { MailModule } from '../mail/mail.module';

@Module({
  providers: [
    OrderService,
    OrderRepository,
    OptionalJwtGuard,
    JwtService,
    OrderStatusHistoryRepository,
    ProductDetailsRepository,
    CouponRepository,
    InvoiceRepository,
    AdminRepository,
  ],
  controllers: [OrderController],
  imports: [CartModule, CouponModule, MailModule],
})
export class OrderModule {}
