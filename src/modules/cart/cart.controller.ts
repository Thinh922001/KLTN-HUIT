import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { BaseController } from '../../vendors/base/base-controller';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CheckManualQuantity } from './dto/check-manual-quantity.entity';

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
}
