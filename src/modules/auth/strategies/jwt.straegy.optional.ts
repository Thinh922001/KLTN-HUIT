import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class OptionalJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers.authorization?.replace('Bearer ', '');
    if (!accessToken) {
      request['user'] = null;
      return true;
    }

    try {
      const data = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
        ignoreExpiration: false,
      });
      request['user'] = data || null;
    } catch (err) {
      request['user'] = null;
    }

    return true;
  }
}
