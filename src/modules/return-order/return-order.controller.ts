import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { ReturnOrderDto } from './dto/return-order.do';
import { ReturnOrderService } from './return-order.service';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { ChangeStatusReturnOrder } from './dto/change-status.dto';

@Controller('return-order')
export class ReturnOrderController extends BaseController {
  constructor(private readonly returnOrderService: ReturnOrderService) {
    super();
  }

  @Post()
  @UseGuards(UserAuthGuard)
  async returnOrder(@AuthUser() user: UserEntity, @Body() body: ReturnOrderDto) {
    const data = await this.returnOrderService.returnOrder(user, body);
    return this.response([]);
  }

  @Post('/admin')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async changeStatusReturnOrder(@Body() body: ChangeStatusReturnOrder) {
    const data = this.returnOrderService.changeStatusOrderReturn(body);
    return this.response([]);
  }
}
