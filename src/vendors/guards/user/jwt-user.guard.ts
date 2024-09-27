import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../../exceptions/errors.exception';
import { AuthGuard } from '@nestjs/passport';
import { ErrorMessage, JsonWebTokenError } from '../../../common/message';

@Injectable()
export class UserAuthGuard extends AuthGuard('user-jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info && info.name) {
        switch (info.name) {
          case JsonWebTokenError.EXPIRED_TOKEN:
            throw new UnauthorizedException(ErrorMessage.EXPIRED_TOKEN);
          case JsonWebTokenError.INVALID_TOKEN:
            throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN);
          case JsonWebTokenError.NOT_BEFORE:
            throw new UnauthorizedException(ErrorMessage.NOT_BEFORE);
          default:
            throw new UnauthorizedException();
        }
      } else throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN);
    }
    return user;
  }
}
