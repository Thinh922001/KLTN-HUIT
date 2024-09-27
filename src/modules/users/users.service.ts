import { Injectable } from '@nestjs/common';
import { AuthData, LoginDto, RefreshTokenDto, RegisterDto } from '../auth/dto/auth.dto';
import { UsersRepository } from '../../repositories/user.repositories';
import { AUTH_TYPE } from '../../common/constaints';
import { BadRequestException, UnauthorizedException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { UserEntity } from '../../entities/user.entity';
import { saltHasPassword } from '../../utils/utils';
import { compareSync, hash } from 'bcrypt';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository, private jwtService: JwtService) {}
  async register({ email, password }: RegisterDto) {
    // check user
    const user = await this.findByEmail(email);

    if (user) {
      throw new BadRequestException(ErrorMessage.USER_EXISTED);
    }

    const salt = await saltHasPassword();

    const hashPassword = await hash(password, salt);

    const newUser = Object.assign(new UserEntity(), {
      password: hashPassword,
      email: email,
      accountType: AUTH_TYPE.USER_PASSWORD,
    });

    await this.userRepo.save(this.userRepo.create(newUser));
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email: email } });
  }

  async findById(id: number) {
    return await this.userRepo.findOne({ where: { id: id } });
  }

  async login(loginDto: LoginDto) {
    const user = await this.verifyUser(loginDto);

    const payload = { id: user.id, email: user.email };
  }

  async verifyUser(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.findByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException(ErrorMessage.INVALID_USER);
    }

    const comparePw = compareSync(loginDto.password, user.password);

    if (!comparePw) {
      throw new BadRequestException(ErrorMessage.INVALID_USER);
    }

    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userRepo.update(
      { id: userId },
      {
        refreshToken: refreshToken,
      }
    );
  }

  createAuthToken(payload: { id: number; email: string }): AuthData {
    const { accessToken, expired } = this.generateAccessToken(payload);
    const { refreshToken } = this.generateRefreshToken(payload);

    return { accessToken, refreshToken, expired, tokenType: 'Bearer' };
  }

  generateRefreshToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME)).toISOString();
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.USER_JWT_REFRESH_KEY,
      expiresIn: parseInt(process.env.USER_JWT_REFRESH_TOKEN_EXPIRE_TIME),
    });
    return { refreshToken, expired };
  }

  generateAccessToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME)).toISOString();
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.USER_JWT_ACCESS_KEY,
      expiresIn: parseInt(process.env.USER_JWT_ACCESS_TOKEN_EXPIRE_TIME),
    });
    return { accessToken, expired };
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    try {
      const data = this.jwtService.verify(refreshToken, {
        secret: process.env.USER_JWT_REFRESH_KEY,
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
