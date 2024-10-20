import { Module } from '@nestjs/common';
import { UserReactionRepository } from '../../repositories';
import { UserReactionController } from './user-reaction.controller';
import { UserReactionService } from './user-reaction.service';
import { UserJwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserReactionService, UserReactionRepository, JwtService],
  controllers: [UserReactionController],
})
export class UserReactionModule {}
