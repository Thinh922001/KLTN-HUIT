import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserReactionService } from './user-reaction.service';
import { BaseController } from '../../vendors/base/base-controller';
import { AddReactionComment } from './dto/user-reaction.dto';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';

@Controller('user-reaction')
export class UserReactionController extends BaseController {
  constructor(private readonly userReactionService: UserReactionService) {
    super();
  }

  @Post()
  @UseGuards(UserAuthGuard)
  async addReaction(@AuthUser() user: UserEntity, @Body() body: AddReactionComment) {
    const data = await this.userReactionService.addReaction(user.id, body);
    return this.response(data);
  }
}
