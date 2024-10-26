import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProductRepository, UserReactionRepository } from '../../repositories';
import { UserReactionController } from './user-reaction.controller';
import { UserReactionService } from './user-reaction.service';
import { WebSocketModule } from '../../Gateway/app.gateway.module';

@Module({
  providers: [UserReactionService, UserReactionRepository, JwtService, ProductRepository],
  controllers: [UserReactionController],
  imports: [WebSocketModule],
})
export class UserReactionModule {}
