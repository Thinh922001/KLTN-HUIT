import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UserCodeRepository } from '../../repositories';
import { UsersRepository } from '../../repositories/user.repositories';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SnsService } from '../sns/sns.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: parseInt(process.env.JWT_EXPIRE_TIME, 10) },
    }),
  ],
  providers: [UsersService, UsersRepository, UserCodeRepository, SnsService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
