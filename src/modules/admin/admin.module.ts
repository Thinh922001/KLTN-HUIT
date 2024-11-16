import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from '../../repositories/admin.repository';
import { JwtService } from '@nestjs/jwt';
import { AdminJwtStrategy } from './strategy/admin.strategy';

@Module({
  providers: [AdminService, AdminRepository, JwtService, AdminJwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
