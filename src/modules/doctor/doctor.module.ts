import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsEntity } from '../../entities/doctor.entity';
import { DoctorRepository } from '../../repositories/doctor.repositories';
import { JwtModule } from '@nestjs/jwt';
import { DoctorJwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorsEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRE_TIME, 10) },
    }),
  ],
  controllers: [DoctorController],
  providers: [DoctorService, DoctorRepository, DoctorJwtStrategy],
})
export class DoctorModule {}
