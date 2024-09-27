import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../../repositories/admin.repositories';
import { AuthData, LoginDto, RefreshTokenDto } from '../auth/dto/auth.dto';
import { AdminEntity } from '../../entities/admin.entity';
import { BadRequestException, UnauthorizedException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { compareSync, hash } from 'bcrypt';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { AdminDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepo: AdminRepository, private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const user = await this.verifyUser(loginDto);

    const payload = {
      id: user.id,
      email: user.email,
    };

    const data = this.createAuthToken(payload);

    await this.updateRefreshToken(user.id, data.refreshToken);

    const userDto = new AdminDto(user);

    return { data, userDto };
  }

  async verifyUser(loginDto: LoginDto): Promise<AdminEntity> {
    const admin = await this.findByEmail(loginDto.email);

    if (!admin) {
      throw new BadRequestException(ErrorMessage.INVALID_USER);
    }

    const comparePw = compareSync(loginDto.password, admin.password);

    if (!comparePw) {
      throw new BadRequestException(ErrorMessage.INVALID_USER);
    }

    return admin;
  }

  async findByEmail(email: string) {
    return await this.adminRepo.findOne({ where: { email: email } });
  }

  createAuthToken(payload: { id: number; email: string }): AuthData {
    const { accessToken, expired } = this.generateAccessToken(payload);
    const { refreshToken } = this.generateRefreshToken(payload);

    return { accessToken, refreshToken, expired, tokenType: 'Bearer' };
  }

  generateRefreshToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME)).toISOString();
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.ADMIN_JWT_REFRESH_KEY,
      expiresIn: parseInt(process.env.ADMIN_JWT_REFRESH_TOKEN_EXPIRE_TIME),
    });
    return { refreshToken, expired };
  }

  generateAccessToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME)).toISOString();
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ADMIN_JWT_ACCESS_KEY,
      expiresIn: parseInt(process.env.ADMIN_JWT_ACCESS_TOKEN_EXPIRE_TIME),
    });
    return { accessToken, expired };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.adminRepo.update(
      { id: userId },
      {
        refreshToken: refreshToken,
      }
    );
  }

  async logout({ id }: AdminEntity) {
    await this.updateRefreshToken(id, '');
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    try {
      const data = this.jwtService.verify(refreshToken, {
        secret: process.env.ADMIN_JWT_REFRESH_KEY,
        ignoreExpiration: false,
      });

      if (!data) {
        throw new UnauthorizedException(ErrorMessage.EXPIRED_TOKEN);
      }

      const { id, email } = data;

      const authToken = this.createAuthToken({ id: id, email });

      return {
        ...authToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(ErrorMessage.EXPIRED_TOKEN);
    }
  }
}
