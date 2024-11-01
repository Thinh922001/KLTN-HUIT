import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponRepository } from '../../repositories';
import { CheckCouponDto } from './dto/check-coupon.dto';
import { CouponEntity } from '../../entities';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { compareDates, getAdjustedTimeWithTimeZone } from '../../utils/date';
import { ErrorMessage } from '../../common/message';
import { calculateDiscountedAmount } from '../../utils/utils';

@Injectable()
export class CouponService {
  couponAlias: string;
  constructor(private readonly couponRepo: CouponRepository) {
    this.couponAlias = CouponEntity.name;
  }

  async createCoupon(createCouponDto: CreateCouponDto) {
    const couponEntity = new CouponEntity();
    couponEntity.code = createCouponDto.code;
    couponEntity.discount_type = createCouponDto.discountType;
    couponEntity.discount_value = createCouponDto.discountValue;
    couponEntity.expiration_date = new Date(getAdjustedTimeWithTimeZone(createCouponDto.validityPeriodInDays, 'days'));
    couponEntity.is_active = createCouponDto.isActive;
    couponEntity.usage_limit = createCouponDto.usageLimit;
    return await this.couponRepo.save(couponEntity);
  }

  async checkCoupon({ code, totalAmount }: CheckCouponDto) {
    const coupon = await this.couponRepo
      .createQueryBuilder(this.couponAlias)
      .where(`${this.couponAlias}.code =:code`, { code })
      .select([
        `${this.couponAlias}.id`,
        `${this.couponAlias}.expiration_date`,
        `${this.couponAlias}.discount_value`,
        `${this.couponAlias}.discount_type`,
        `${this.couponAlias}.is_active`,
        `${this.couponAlias}.usage_limit`,
        `${this.couponAlias}.times_used`,
      ])
      .getOne();

    if (!coupon) {
      throw new BadRequestException(ErrorMessage.INVALID_COUPON);
    }

    if (!coupon.is_active) {
      throw new BadRequestException(ErrorMessage.COUPON_NOT_ACTIVE);
    }

    if (compareDates(coupon.expiration_date, new Date(getAdjustedTimeWithTimeZone())) === -1) {
      throw new BadRequestException(ErrorMessage.COUPON_EXPIRED);
    }

    if (coupon.times_used >= coupon.usage_limit) {
      throw new BadRequestException(ErrorMessage.EXCEEDED_COUPON);
    }

    return {
      id: coupon.id,
      timeUsed: coupon.times_used,
      disCountType: coupon.discount_type,
      disCountValue: +coupon.discount_value,
      totalAmount: calculateDiscountedAmount(coupon, totalAmount),
    };
  }
}
