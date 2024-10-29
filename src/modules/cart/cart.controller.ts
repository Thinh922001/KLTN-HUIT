import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { BaseController } from '../../vendors/base/base-controller';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CheckManualQuantity } from './dto/check-manual-quantity.entity';
import { SyncCartDto } from './dto/sync-cart.dto';
import { UserAuthGuard } from '../../vendors/guards/user/jwt-user.guard';
import { AuthUser } from '../../vendors/decorator/user.decorator';
import { UserEntity } from '../../entities';
import { DeleteCartDto } from './dto/delete.cart.dto';

@Controller('cart')
export class CartController extends BaseController {
  constructor(private readonly cartService: CartService) {
    super();
  }

  @Post('add-to-cart')
  async addToCart(@Body() params: AddToCartDto) {
    const data = await this.cartService.addToCart(params);
    return this.response(data);
  }

  @Post('manual-quantity')
  async checkManualQuantity(@Body() body: CheckManualQuantity) {
    const data = await this.cartService.checkManualQuantity(body);
    return this.response(data);
  }

  @Post('sync')
  @UseGuards(UserAuthGuard)
  async syncCart(@AuthUser() user: UserEntity, @Body() body: SyncCartDto) {
    const data = await this.cartService.syncCart(user, body);
    return this.response(data);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async getCart(@AuthUser() user: UserEntity) {
    const data = await this.cartService.getCart(user);
    return this.response(data);
  }

  @Delete()
  @UseGuards(UserAuthGuard)
  async deleteCart(@AuthUser() user: UserEntity, @Body() body: DeleteCartDto) {
    const data = await this.cartService.deleteCart(user, body);
    return this.response(data);
  }
}
