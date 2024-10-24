import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentService } from './comment.service';
import { BaseController } from '../../vendors/base/base-controller';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';
import { OptionalJwtGuard } from '../auth/strategies/jwt.straegy.optional';

@Controller('comment')
export class CommentController extends BaseController {
  constructor(private readonly commentService: CommentService) {
    super();
  }

  @Get()
  async getComment(@Query() params: GetCommentDto) {
    const data = await this.commentService.getComment(params);
    return this.response(data);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('img'))
  @UseGuards(OptionalJwtGuard)
  async createComment(
    @AuthUser() user: UserEntity,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createCommentDto: CreateCommentDto
  ) {
    const data = await this.commentService.createComment(user?.id, createCommentDto, files);
    return this.response(data);
  }
}
