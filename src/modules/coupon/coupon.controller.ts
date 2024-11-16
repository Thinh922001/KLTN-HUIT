import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CheckCouponDto } from './dto/check-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { BaseController } from '../../vendors/base/base-controller';
import { CouponService } from './coupon.service';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Controller()
export class CouponController extends BaseController {
  constructor(private readonly couponService: CouponService) {
    super();
  }

  @Post('admin/coupon')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async createCoupon(@Body() body: CreateCouponDto) {
    const data = await this.couponService.createCoupon(body);
    return this.response(data);
  }

  @Get('admin/coupon')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getAllCoupon() {
    const data = await this.couponService.getAllCoupon();
    return this.response(data);
  }

  @Patch('admin/coupon/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async update(@Param('id') couponId: number, @Body() body: UpdateCouponDto) {
    const data = await this.couponService.updateCoupon(couponId, body);
    return this.response(data);
  }

  @Delete('admin/coupon/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async delete(@Param('id') couponId: number) {
    const data = await this.couponService.deleteCoupon(couponId);
    return this.response(data);
  }

  @Post('coupon/check')
  async checkCoupon(@Body() body: CheckCouponDto) {
    const data = await this.couponService.checkCoupon(body);
    return this.response(data);
  }
}
