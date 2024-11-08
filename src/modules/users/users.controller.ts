import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { UserEntity } from '../../entities';
import { BaseController } from '../../vendors/base/base-controller';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController extends BaseController {
  constructor(private readonly userService: UsersService) {
    super();
  }

  @Patch()
  @UseGuards(UserAuthGuard)
  async updateUser(@AuthUser() user: UserEntity, @Body() updateUser: UpdateUserDto) {
    const data = await this.userService.updateUser(user, updateUser);
    return this.response(data);
  }
}
