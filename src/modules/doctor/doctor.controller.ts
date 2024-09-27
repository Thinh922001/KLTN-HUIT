import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-comtroller';
import { DoctorService } from './doctor.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from '../auth/dto/auth.dto';
import { DoctorAuthGuard } from '../../vendors/guards/doctor/jwt-doctor.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { DoctorsEntity } from '../../entities/doctor.entity';

@Controller('doctor')
export class DoctorController extends BaseController {
  constructor(private readonly doctorService: DoctorService) {
    super();
  }

  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.doctorService.register(registerDto);
    return this.response({});
  }

  @Get('auth/login')
  async auth(@Body() loginDto: LoginDto) {
    const data = await this.doctorService.login(loginDto);
    return this.response(data);
  }

  @Post('auth/logout')
  @UseGuards(DoctorAuthGuard)
  async logout(@AuthUser() user: DoctorsEntity) {
    const data = await this.doctorService.logout(user);
    return this.response({});
  }

  @Post('auth/refresh_token')
  async refreshToken(@Body() rerefreshTokenDto: RefreshTokenDto) {
    const data = await this.doctorService.refreshToken(rerefreshTokenDto);
    return this.response(data);
  }
}
