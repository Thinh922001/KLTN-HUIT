import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../../entities/admin.entity';
import { AdminRepository } from '../../repositories/admin.repositories';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRE_TIME, 10) },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, AdminJwtStrategy],
})
export class AdminModule {}
