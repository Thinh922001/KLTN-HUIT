import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { CouponRepository } from '../../repositories';

@Module({
  providers: [CouponService, CouponRepository],
  controllers: [CouponController],
  exports: [CouponService],
})
export class CouponModule {}
