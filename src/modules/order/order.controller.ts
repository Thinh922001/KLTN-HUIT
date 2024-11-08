import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { BaseController } from '../../vendors/base/base-controller';
import { OrderDto } from './dto/order.dto';
import { OptionalJwtGuard } from '../auth/strategies/jwt.straegy.optional';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';
import { GetOrder } from './dto/get-order.dto';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';

@Controller('order')
export class OrderController extends BaseController {
  constructor(private readonly orderService: OrderService) {
    super();
  }

  @Post()
  @UseGuards(OptionalJwtGuard)
  async createOrder(@AuthUser() user: UserEntity, @Body() body: OrderDto) {
    const data = await this.orderService.createOrder(user, body);
    return this.response(data);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async getOrder(@AuthUser() user: UserEntity, @Body() body: GetOrder) {
    const data = await this.orderService.getOrder(user, body);
    return this.response(data);
  }
}
