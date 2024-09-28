import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import { UserDto } from '../users/dto/user.dto';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async register(registerDto: RegisterDto) {
    // check user exist
    await this.userService.register(registerDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.verifyUser(loginDto);

    const payload = {
      id: user.id,
      email: user.email,
    };

    const data = this.userService.createAuthToken(payload);

    await this.userService.updateRefreshToken(user.id, data.refreshToken);

    const userDto = new UserDto(user);

    return { data, userDto };
  }

  async logout({ id }: UserEntity) {
    await this.userService.updateRefreshToken(id, '');
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  /* Only test import data */
}
