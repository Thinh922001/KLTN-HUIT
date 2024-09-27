import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserDto } from '../../../modules/users/dto/user.dto';

export class RegisterDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be longer than or equal to 8 characters' })
  password: string;
}

export class LoginDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be longer than or equal to 8 characters' })
  password: string;
}

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refreshToken : string
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  expired: string;
  tokenType: string;
}

export interface AuthDto<T> {
  auth: AuthData;
  user: T;
}
