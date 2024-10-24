import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UserJwtStrategy } from './strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { OptionalJwtGuard } from './strategies/jwt.straegy.optional';
@Module({
  imports: [UsersModule],
  providers: [AuthService, UserJwtStrategy, JwtService, OptionalJwtGuard],
  controllers: [AuthController],
})
export class AuthModule {}
