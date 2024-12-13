import { Controller, Get, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController extends BaseController {
  constructor(private readonly walletsService: WalletsService) {
    super();
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async getUserWallets(@AuthUser() user: UserEntity) {
    const data = await this.walletsService.getUserWallet(user.id);
    return this.response(data);
  }
}
