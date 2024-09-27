import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-comtroller';
import { AdminService } from './admin.service';
import { LoginDto, RefreshTokenDto } from '../auth/dto/auth.dto';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { AdminEntity } from '../../entities/admin.entity';

@Controller('admin')
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  @Get('auth/login')
  async auth(@Body() loginDto: LoginDto) {
    const data = await this.adminService.login(loginDto);
    return this.response(data);
  }

  @Post('auth/logout')
  @UseGuards(AdminAuthGuard)
  async logout(@AuthUser() user: AdminEntity) {
    const data = await this.adminService.logout(user);
    return this.response({});
  }

  @Post('auth/refresh_token')
  async refreshToken(@Body() rerefreshTokenDto: RefreshTokenDto) {
    const data = await this.adminService.refreshToken(rerefreshTokenDto);
    return this.response(data);
  }
}
