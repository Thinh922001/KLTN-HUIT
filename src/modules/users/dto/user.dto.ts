import { AUTH_TYPE } from '../../../common/constaints';
import { UserEntity } from '../../../entities/user.entity';

export class UserDto {
  id: number;
  email: string;
  accountType: AUTH_TYPE;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
  }
}
