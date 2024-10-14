import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductDetailsRepository } from '../../repositories';

@Module({
  providers: [CartService, ProductDetailsRepository],
  controllers: [CartController],
})
export class CartModule {}
