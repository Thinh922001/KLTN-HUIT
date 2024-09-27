import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import _ = require('lodash');

@Injectable()
export class DoctorJwtStrategy extends PassportStrategy(Strategy, 'doctor-jwt') {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.DOCTOR_JWT_ACCESS_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    let accessToken = req?.headers.authorization;
    accessToken = accessToken.replace('Bearer ', '');
    const data = this.jwtService.verify(accessToken, {
      secret: process.env.DOCTOR_JWT_ACCESS_KEY,
      ignoreExpiration: false,
    });
    if (_.isNil(data)) {
      return false;
    }
    return data;
  }
}
