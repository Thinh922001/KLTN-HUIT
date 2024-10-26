import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentImgRepository, CommentRepository, ProductRepository, UsersRepository } from '../../repositories';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtService } from '@nestjs/jwt';
import { WebSocketModule } from '../../Gateway/app.gateway.module';

@Module({
  providers: [CommentService, CommentRepository, ProductRepository, UsersRepository, CommentImgRepository, JwtService],
  controllers: [CommentController],
  imports: [CloudinaryModule, WebSocketModule],
})
export class CommentModule {}
