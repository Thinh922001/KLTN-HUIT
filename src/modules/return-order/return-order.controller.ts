import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { ReturnOrderDto } from './dto/return-order.do';
import { ReturnOrderService } from './return-order.service';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { ChangeStatusReturnOrder } from './dto/change-status.dto';
import { GetReturnOrder } from './dto/get-return-order.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('return-order')
export class ReturnOrderController extends BaseController {
  constructor(private readonly returnOrderService: ReturnOrderService) {
    super();
  }

  @Get('/admin')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getReturnOrder(@Query() body: GetReturnOrder) {
    const data = await this.returnOrderService.getReturnOrder(body);
    return this.response(data);
  }

  @Post()
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FilesInterceptor('img'))
  async returnOrder(
    @AuthUser() user: UserEntity,
    @Body() body: ReturnOrderDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const data = await this.returnOrderService.returnOrder(files, user, body);
    return this.response([]);
  }

  @Post('/admin')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async changeStatusReturnOrder(@Body() body: ChangeStatusReturnOrder) {
    const data = await this.returnOrderService.changeStatusOrderReturn(body);
    return this.response([]);
  }
}
