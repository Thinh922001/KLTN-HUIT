import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import { BaseController } from '../../vendors/base/base-controller';
import { AuthService } from './auth.service';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities/user.entity';

@Controller('users/auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Get('login')
  async auth(@Body() loginDto: LoginDto) {
    // const data = await this.authService.login(loginDto);
    return {
      hello: 'thinh huhuhihii',
      raiwyApp: 'Hello',
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return this.response({});
  }

  @Post('refresh_token')
  async refreshToken(@Body() rerefreshTokenDto: RefreshTokenDto) {
    const data = await this.authService.refreshToken(rerefreshTokenDto);
    return this.response(data);
  }

  @Post('logout')
  @UseGuards(UserAuthGuard)
  async logout(@AuthUser() user: UserEntity) {
    const data = await this.authService.logout(user);
    return this.response({});
  }
}
