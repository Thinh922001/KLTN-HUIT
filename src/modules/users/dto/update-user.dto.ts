import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../../types';
import { UserEntity } from '../../../entities';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsString()
  @IsOptional()
  address: string;
}
