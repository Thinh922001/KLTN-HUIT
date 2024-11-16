import { PagerDto } from '../../../vendors/dto/pager.dto';
import { Role } from './register.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class GetAdminDto extends PagerDto {
  @IsOptional()
  @IsEnum(Role)
  roleName: Role;
}
