import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminRepository } from '../../repositories/admin.repository';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { compareSync, hash } from 'bcrypt';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Transactional } from 'typeorm-transactional';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AdminEntity } from '../../entities';
import { GetAdminDto } from './dto/get-admin.dto';
import { applyPagination } from '../../utils/utils';

@Injectable()
export class AdminService {
  adminAlias: string;
  constructor(private readonly adminRepo: AdminRepository, private readonly jwtService: JwtService) {
    this.adminAlias = AdminEntity.name;
  }

  async Login({ email, password }: LoginDto) {
    const admin = await this.validateAdmin({ email, password });

    const auth = this.createAuthToken({ id: admin.id });

    const returnAdmin = { ...admin };
    delete returnAdmin.createdAt;
    delete returnAdmin.deletedAt;
    delete returnAdmin.updatedAt;
    delete returnAdmin.password;

    return {
      auth: auth,
      admin: returnAdmin,
    };
  }

  async validateAdmin(loginDto: LoginDto) {
    const admin = await this.adminRepo.findOne({ where: { email: loginDto.email } });

    if (!admin) {
      throw new BadRequestException(ErrorMessage.INVALID_ADMIN);
    }

    const passwordMatched = compareSync(loginDto.password, admin.password);

    if (!passwordMatched) {
      throw new BadRequestException(ErrorMessage.INVALID_ADMIN);
    }

    return admin;
  }

  createAuthToken(payload: { id: number }) {
    const { accessToken, expired } = this.generateAccessToken(payload);
    const { refreshToken } = this.generateRefreshToken(payload);

    return { accessToken, refreshToken, expired, tokenType: 'Bearer' };
  }

  generateRefreshToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.USER_JWT_REFRESH_TOKEN_EXPIRE_TIME)).toISOString();
    const refreshToken = this.jwtService.sign(payload, {
      secret: `${process.env.USER_JWT_REFRESH_KEY}123`,
      expiresIn: parseInt(process.env.USER_JWT_REFRESH_TOKEN_EXPIRE_TIME),
    });
    return { refreshToken, expired };
  }

  generateAccessToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.JWT_EXPIRE_TIME)).toISOString();
    const accessToken = this.jwtService.sign(payload, {
      secret: `${process.env.JWT_SECRET_KEY}456`,
      expiresIn: parseInt(process.env.JWT_EXPIRE_TIME),
    });
    return { accessToken, expired };
  }

  async checkSupperAdmin(id: number) {
    return await this.adminRepo.exist({ where: { id: id, roleName: 'SUPPER_ADMIN' } });
  }

  @Transactional()
  async register(registerDto: RegisterDto) {
    const isHaveAdmin = await this.adminRepo.exist({ where: { email: registerDto.email } });

    if (isHaveAdmin) {
      throw new BadRequestException(ErrorMessage.ADMIN_EXISTED);
    }

    const password = await this.generatePassword(registerDto.password);

    const adminEntity = this.adminRepo.create({
      name: registerDto.name,
      email: registerDto.email,
      password: password,
      roleName: registerDto.roleName ? registerDto.roleName : 'ADMIN',
    });

    await this.adminRepo.save(adminEntity);
    return [];
  }

  async generatePassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await hash(plainPassword, saltRounds);
    return hashedPassword;
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    try {
      const data = this.jwtService.verify(refreshToken, {
        secret: `${process.env.USER_JWT_REFRESH_KEY}123`,
        ignoreExpiration: false,
      });

      if (!data) {
        throw new UnauthorizedException(ErrorMessage.EXPIRED_TOKEN);
      }

      const { id } = data;

      const authToken = this.createAuthToken({ id: id });

      return {
        ...authToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(ErrorMessage.EXPIRED_TOKEN);
    }
  }

  @Transactional()
  async deleteAccount(admin: AdminEntity, params) {
    if (admin.id == params.id) {
      throw new BadRequestException(ErrorMessage.ADMIN_DELETE_SELF);
    }
    return await this.adminRepo.delete(params.id);
  }

  async getAdmin({ roleName, take, skip }: GetAdminDto) {
    const query = this.adminRepo
      .createQueryBuilder(this.adminAlias)
      .select([
        `${this.adminAlias}.id`,
        `${this.adminAlias}.name`,
        `${this.adminAlias}.email`,
        `${this.adminAlias}.roleName`,
      ]);

    if (roleName) {
      query.andWhere(`${this.adminAlias}.role_name =:roleName`, { roleName });
    }

    const { data, paging } = await applyPagination<AdminEntity>(query, take, skip);

    return {
      data: data,
      paging: paging,
    };
  }
}
