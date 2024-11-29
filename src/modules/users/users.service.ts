import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthData, LoginDto, RefreshTokenDto, RegisterDto } from '../auth/dto/auth.dto';
import { UsersRepository } from '../../repositories/user.repositories';
import { AUTH_TYPE } from '../../common/constaints';
import { BadRequestException, UnauthorizedException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { UserEntity } from '../../entities/user.entity';
import { applyPagination, generateRandomCode, hidePhoneNumber, saltHasPassword, sendOTPMsg } from '../../utils/utils';
import { compareSync, hash } from 'bcrypt';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { RequestCodeDto } from './dto/auth.dto';
import { UserCodeRepository } from '../../repositories';
import { UserCodeEntity } from '../../entities';
import { compareDates, getAdjustedTimeWithTimeZone } from '../../utils/date';
import { Transactional } from 'typeorm-transactional';
import { SnsService } from '../sns/sns.service';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  userAlias: string;
  userCodeAlias: string;
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly userCodeRepo: UserCodeRepository,
    private readonly snsService: SnsService,
    private jwtService: JwtService
  ) {
    this.userAlias = UserEntity.name;
    this.userCodeAlias = UserCodeEntity.name;
  }
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

  createAuthToken(payload: { id: number }): AuthData {
    const { accessToken, expired } = this.generateAccessToken(payload);
    const { refreshToken } = this.generateRefreshToken(payload);

    return { accessToken, refreshToken, expired, tokenType: 'Bearer' };
  }

  generateRefreshToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.USER_JWT_REFRESH_TOKEN_EXPIRE_TIME)).toISOString();
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.USER_JWT_REFRESH_KEY,
      expiresIn: parseInt(process.env.USER_JWT_REFRESH_TOKEN_EXPIRE_TIME),
    });
    return { refreshToken, expired };
  }

  generateAccessToken(payload: any) {
    const expired: string = moment().second(parseInt(process.env.JWT_EXPIRE_TIME)).toISOString();
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: parseInt(process.env.JWT_EXPIRE_TIME),
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
  async requestCode({ phone }: RequestCodeDto) {
    const userWithCode = await this.userRepo
      .createQueryBuilder(this.userAlias)
      .leftJoinAndSelect(`${this.userAlias}.userCode`, this.userCodeAlias)
      .where(`${this.userAlias}.phone = :phone`, { phone })
      .select([`${this.userAlias}.id`, `${this.userCodeAlias}.id`, `${this.userCodeAlias}.expiration_date`])
      .getOne();

    if (!userWithCode) {
      throw new BadRequestException(ErrorMessage.PHONE_NOT_EXIST);
    }

    const code = generateRandomCode();
    let userCode = userWithCode?.userCode;

    const currentDate = new Date(getAdjustedTimeWithTimeZone());

    if (userCode) {
      const expirationDate = userCode.expiration_date;

      if (compareDates(expirationDate, currentDate) === 1) {
        throw new BadRequestException(ErrorMessage.NOT_EXPIRED);
      }

      userCode.code = code;
    } else {
      userCode = new UserCodeEntity();
      userCode.user = { id: userWithCode.id } as UserEntity;
      userCode.code = code;
    }

    await this.userCodeRepo.save(userCode);

    return [];
  }

  @Transactional()
  async verifyCode({ code, phone }: VerifyCodeDto) {
    const userWithCode = await this.userRepo
      .createQueryBuilder(this.userAlias)
      .leftJoinAndSelect(`${this.userAlias}.userCode`, this.userCodeAlias)
      .where(`${this.userAlias}.phone = :phone`, { phone })
      .select([
        `${this.userAlias}.id`,
        `${this.userAlias}.name`,
        `${this.userAlias}.phone`,
        `${this.userAlias}.gender`,
        `${this.userCodeAlias}.id`,
        `${this.userCodeAlias}.expiration_date`,
        `${this.userCodeAlias}.code`,
      ])
      .getOne();

    if (!userWithCode) {
      throw new BadRequestException(ErrorMessage.PHONE_NOT_EXIST);
    }

    if (!userWithCode?.userCode) {
      throw new BadRequestException(ErrorMessage.NEED_REQUEST_CODE);
    }

    if (userWithCode.userCode.code != code) {
      throw new BadRequestException(ErrorMessage.INVALID_CODE);
    }

    const currentDate = new Date(getAdjustedTimeWithTimeZone());

    if (compareDates(userWithCode.userCode.expiration_date, currentDate) === -1) {
      throw new BadRequestException(ErrorMessage.EXPIRED_DATE);
    }

    const auth = this.createAuthToken({ id: userWithCode.id });

    await this.userCodeRepo.delete({ code: code });

    return {
      user: {
        id: userWithCode.id,
        name: userWithCode?.name || hidePhoneNumber(userWithCode.phone),
        gender: userWithCode.gender || 'male',
      },
      auth,
    };
  }

  @Transactional()
  async updateUser(user: Partial<UserEntity>, { name, gender, address }: UpdateUserDto) {
    const updateData: Partial<UserEntity> = {};
    if (name !== undefined) updateData.name = name;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;

    if (Object.keys(updateData).length === 0) {
      return new BadRequestException(ErrorMessage.INVALID_UPDATE_USER);
    }

    const result = await this.userRepo.update(user.id, updateData);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    return {
      message: 'User updated successfully',
      updatedFields: updateData,
    };
  }

  async getUsers({ take, skip }: GetUser) {
    const query = this.userRepo
      .createQueryBuilder(this.userAlias)
      .select([
        `${this.userAlias}.id`,
        `${this.userAlias}.name`,
        `${this.userAlias}.phone`,
        `${this.userAlias}.address`,
        `${this.userAlias}.gender`,
      ]);

    const { data, paging } = await applyPagination<UserEntity>(query, take, skip);

    return {
      data: data,
      paging: paging,
    };
  }

  async getUserById(userId: number) {
    const user = await this.userRepo
      .createQueryBuilder(this.userAlias)
      .where(`${this.userAlias}.id =:userId`, { userId })
      .select([
        `${this.userAlias}.id`,
        `${this.userAlias}.name`,
        `${this.userAlias}.phone`,
        `${this.userAlias}.address`,
        `${this.userAlias}.gender`,
      ])
      .getOne();

    return user;
  }

  async deleteUser(userId: number) {
    return await this.userRepo.softDelete({ id: userId });
  }

  async restoreUser(userId: number) {
    return await this.userRepo.restore({ id: userId });
  }
}
