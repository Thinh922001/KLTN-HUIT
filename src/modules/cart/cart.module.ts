import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItemsRepository, ProductDetailsRepository } from '../../repositories';
import { CartRepository } from '../../repositories/cart.repository';

@Module({
  providers: [CartService, ProductDetailsRepository, CartRepository, CartItemsRepository],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
