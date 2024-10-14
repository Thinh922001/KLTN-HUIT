import { Body, Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { BaseController } from '../../vendors/base/base-controller';
import { AddToCartDto } from './dto/add-to-cart.dto';

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
}
