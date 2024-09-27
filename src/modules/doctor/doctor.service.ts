import { Injectable } from '@nestjs/common';
import { DoctorRepository } from '../../repositories/doctor.repositories';
import { AuthData, LoginDto, RefreshTokenDto, RegisterDto } from '../auth/dto/auth.dto';
import { AUTH_TYPE } from '../../common/constaints';
import { BadRequestException, UnauthorizedException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { saltHasPassword } from '../../utils/utils';
import { compareSync, hash } from 'bcrypt';
import { DoctorsEntity } from '../../entities/doctor.entity';
import { UserDto } from '../users/dto/user.dto';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DoctorService {
  constructor(private readonly doctorRepo: DoctorRepository, private jwtService: JwtService) {}

  async findByEmail(email: string) {
    return await this.doctorRepo.findOne({ where: { email: email, accountType: AUTH_TYPE.USER_PASSWORD } });
  }

  async register({ email, password }: RegisterDto) {
    // check user
    const doctor = await this.findByEmail(email);

    if (doctor) {
      throw new BadRequestException(ErrorMessage.USER_EXISTED);
    }

    const salt = await saltHasPassword();

    const hashPassword = await hash(password, salt);

    const newUser = Object.assign(new DoctorsEntity(), {
      password: hashPassword,
      email: email,
      accountType: AUTH_TYPE.USER_PASSWORD,
    });

    await this.doctorRepo.save(this.doctorRepo.create(newUser));
  }

  async verifyUser(loginDto: LoginDto): Promise<DoctorsEntity> {
    const doctor = await this.findByEmail(loginDto.email);

    if (!doctor) {
      throw new BadRequestException(ErrorMessage.INVALID_USER);
    }

    const comparePw = compareSync(loginDto.password, doctor.password);

    if (!comparePw) {
      throw new BadRequestException(ErrorMessage.INVALID_USER);
    }

    return doctor;
  }

  async login(loginDto: LoginDto) {
    const user = await this.verifyUser(loginDto);

    const payload = {
      id: user.id,
      email: user.email,
    };

    const data = this.createAuthToken(payload);

    await this.updateRefreshToken(user.id, data.refreshToken);

    const userDto = new UserDto(user);

    return { data, userDto };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.doctorRepo.update(
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
      secret: process.env.DOCTOR_JWT_REFRESH_KEY,
      expiresIn: parseInt(process.env.DOCTOR_JWT_REFRESH_TOKEN_EXPIRE_TIME),
    });
    return { refreshToken, expired };
  }

  generateAccessToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME)).toISOString();
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.DOCTOR_JWT_ACCESS_KEY,
      expiresIn: parseInt(process.env.DOCTOR_JWT_ACCESS_TOKEN_EXPIRE_TIME),
    });
    return { accessToken, expired };
  }

  async logout({ id }: DoctorsEntity) {
    await this.updateRefreshToken(id, '');
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    try {
      const data = this.jwtService.verify(refreshToken, {
        secret: process.env.DOCTOR_JWT_REFRESH_KEY,
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
