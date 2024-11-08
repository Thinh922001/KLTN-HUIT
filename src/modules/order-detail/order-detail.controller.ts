import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';
import { GetOrderDetail } from './dto/get-order-detail.dto';
import { OrderDetailService } from './order-detail.service';

@Controller('order-detail')
export class OrderDetailController extends BaseController {
  constructor(private readonly orderDetailService: OrderDetailService) {
    super();
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async getOrderDetail(@AuthUser() user: UserEntity, @Query() params: GetOrderDetail) {
    const data = await this.orderDetailService.getOrderDetail(user, params);
    return this.response(data);
  }
}
