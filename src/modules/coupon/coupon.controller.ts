import { Body, Controller, Post } from '@nestjs/common';
import { CheckCouponDto } from './dto/check-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { BaseController } from '../../vendors/base/base-controller';
import { CouponService } from './coupon.service';

@Controller('coupon')
export class CouponController extends BaseController {
  constructor(private readonly couponService: CouponService) {
    super();
  }

  @Post()
  async createCoupon(@Body() body: CreateCouponDto) {
    const data = await this.couponService.createCoupon(body);
    return this.response(data);
  }

  @Post('check')
  async checkCoupon(@Body() body: CheckCouponDto) {
    const data = await this.couponService.checkCoupon(body);
    return this.response(data);
  }
}
