import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import _ = require('lodash');

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET_KEY}456`,
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    let accessToken = req?.headers.authorization;
    accessToken = accessToken.replace('Bearer ', '');
    const data = this.jwtService.verify(accessToken, {
      secret: `${process.env.JWT_SECRET_KEY}456`,
      ignoreExpiration: false,
    });
    if (_.isNil(data)) {
      return false;
    }
    return data;
  }
}
