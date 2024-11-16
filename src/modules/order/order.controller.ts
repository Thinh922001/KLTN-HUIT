import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { BaseController } from '../../vendors/base/base-controller';
import { OrderDto } from './dto/order.dto';
import { OptionalJwtGuard } from '../auth/strategies/jwt.straegy.optional';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';
import { GetOrder } from './dto/get-order.dto';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { GetOrderAd } from './dto/get-order-admin';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { UpdateOrderStatus } from './dto/update-order-status.dto';

@Controller()
export class OrderController extends BaseController {
  constructor(private readonly orderService: OrderService) {
    super();
  }

  @Post('order')
  @UseGuards(OptionalJwtGuard)
  async createOrder(@AuthUser() user: UserEntity, @Body() body: OrderDto) {
    const data = await this.orderService.createOrder(user, body);
    return this.response(data);
  }

  @Get('order')
  @UseGuards(UserAuthGuard)
  async getOrder(@AuthUser() user: UserEntity, @Query() body: GetOrder) {
    const data = await this.orderService.getOrder(user, body);
    return this.response(data);
  }

  @Get('admin/order')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getOrderAd(@Query() body: GetOrderAd) {
    const data = await this.orderService.getOrderAd(body);
    return this.response(data);
  }

  @Get('admin/order/user/:id')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getOrderByUserId(@Param('id') userId: number) {
    const data = await this.orderService.getOrderByUserId(userId);
    return this.response(data);
  }

  @Put('admin/order/status')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async updateOrderStatus(@Body() body: UpdateOrderStatus) {
    const data = await this.orderService.updateOrderStatus(body);
    return this.response([]);
  }
}
