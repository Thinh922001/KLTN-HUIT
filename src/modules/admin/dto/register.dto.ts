import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { MatchPassword } from './../../../vendors/decorator/validate';

export enum Role {
  ADMIN = 'ADMIN',
  SUPPER_ADMIN = 'SUPPER_ADMIN',
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  @IsOptional()
  roleName: Role;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MatchPassword('password', { message: 'Confirm Password must match Password' })
  confirmPassword: string;
}
