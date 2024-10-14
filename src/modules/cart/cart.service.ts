import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductDetailsRepository } from '../../repositories';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductDetailsEntity, ProductsEntity } from '../../entities';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  proDetailAlias: string;
  productAlias: string;
  constructor(private readonly productDetailRepo: ProductDetailsRepository) {
    this.proDetailAlias = ProductDetailsEntity.name;
    this.productAlias = ProductsEntity.name;
  }

  async addToCart({ detailId }: AddToCartDto) {
    const productDetail = await this.productDetailRepo
      .createQueryBuilder(this.proDetailAlias)
      .innerJoinAndSelect(`${this.proDetailAlias}.product`, this.productAlias)
      .where(`${this.proDetailAlias}.id = :detailId`, { detailId })
      .select([
        `${this.productAlias}.id`,
        `${this.productAlias}.img`,
        `${this.productAlias}.productName`,
        `${this.proDetailAlias}.id`,
        `${this.proDetailAlias}.price`,
        `${this.proDetailAlias}.oldPrice`,
        `${this.proDetailAlias}.variationDetails`,
        `${this.proDetailAlias}.stock`,
      ])
      .getOne();

    if (!productDetail) {
      throw new BadRequestException('Product not found');
    }

    if (!productDetail.stock || productDetail.stock < 1) {
      throw new Error('Out of stock');
    }

    return new CartDto(productDetail);
  }
}
