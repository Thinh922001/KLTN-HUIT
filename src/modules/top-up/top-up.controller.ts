import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserEntity } from '../../entities';
import { BaseController } from '../../vendors/base/base-controller';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { TopUpDto } from './dto/top-up.dto';
import { TopUpService } from './top-up.service';

@Controller()
export class TopUpController extends BaseController {
  constructor(private readonly topUpService: TopUpService) {
    super();
  }

  @Post('top-up')
  @UseGuards(UserAuthGuard)
  async topUp(@AuthUser() user: UserEntity, @Body() topUpDto: TopUpDto) {
    const result = await this.topUpService.topUp(user, topUpDto);
    return this.response(result);
  }

  @Post('/callback')
  async callBack(@Req() req: Request) {
    await this.topUpService.applyTopUp(req.body as any);
  }
}
