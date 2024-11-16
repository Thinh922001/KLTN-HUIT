import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponRepository, OrderRepository } from '../../repositories';

@Module({
  providers: [CouponService, CouponRepository, OrderRepository],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
