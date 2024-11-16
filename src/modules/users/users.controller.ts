import { Body, Controller, Delete, Get, Param, Patch, Put, Query, UseGuards } from '@nestjs/common';
import { UserEntity } from '../../entities';
import { BaseController } from '../../vendors/base/base-controller';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { GetUser } from './dto/get-user.dto';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';

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

  @Get()
  @UseGuards(AdminAuthGuard)
  @UseGuards(ApiKeyGuard)
  async getUser(@Query() params: GetUser) {
    const data = await this.userService.getUsers(params);
    return this.response(data);
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(ApiKeyGuard)
  async getUserById(@Param('id') id: number) {
    const data = await this.userService.getUserById(id);
    return this.response(data);
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(ApiKeyGuard)
  async updateUserAd(@Param('id') userId: number, @Body() updateUser: UpdateUserDto) {
    const data = await this.userService.updateUser({ id: userId }, updateUser);
    return this.response(data);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(ApiKeyGuard)
  async deleteUser(@Param('id') userId: number) {
    const data = await this.userService.deleteUser(userId);
    return this.response([]);
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(ApiKeyGuard)
  async restoreUser(@Param('id') userId: number) {
    const data = await this.userService.restoreUser(userId);
    return this.response([]);
  }
}
