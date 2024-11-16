import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';
import { SupperAdminGuard } from '../../vendors/guards/admin/admin.role';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { AdminEntity } from '../../entities';
import { GetAdminDto } from './dto/get-admin.dto';

@Controller('admin')
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  @Post('auth/login')
  @UseGuards(ApiKeyGuard)
  async Login(@Body() body: LoginDto) {
    const data = await this.adminService.Login(body);
    return this.response(data);
  }

  @Post('auth/register')
  @UseGuards(ApiKeyGuard, AdminAuthGuard, SupperAdminGuard)
  async register(@Body() body: RegisterDto) {
    const data = await this.adminService.register(body);
    return this.response(data);
  }

  @Post('auth/refresh_token')
  @UseGuards(ApiKeyGuard)
  async refreshToken(@Body() body: RefreshTokenDto) {
    const data = await this.adminService.refreshToken(body);
    return this.response(data);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard, AdminAuthGuard, SupperAdminGuard)
  async deleteAccount(@AuthUser() admin: AdminEntity, @Param() params) {
    const data = await this.adminService.deleteAccount(admin, params);
    return this.response([]);
  }

  @Get()
  @UseGuards(ApiKeyGuard, AdminAuthGuard, SupperAdminGuard)
  async getAdmin(@Query() body: GetAdminDto) {
    const data = await this.adminService.getAdmin(body);
    return this.response(data);
  }
}
