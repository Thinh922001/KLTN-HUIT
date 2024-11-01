import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from '../../repositories/order.repository';
import { CartModule } from '../cart/cart.module';
import { CouponModule } from '../coupon/coupon.module';
import { OptionalJwtGuard } from '../auth/strategies/jwt.straegy.optional';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [OrderService, OrderRepository, OptionalJwtGuard, JwtService],
  controllers: [OrderController],
  imports: [CartModule, CouponModule],
})
export class OrderModule {}
