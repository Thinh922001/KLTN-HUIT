import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductDetailsRepository } from '../../repositories';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductDetailsEntity, ProductsEntity } from '../../entities';
import { CartDto } from './dto/cart.dto';
import { CheckManualQuantity } from './dto/check-manual-quantity.entity';

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
      throw new BadRequestException('Out of stock');
    }

    return new CartDto(productDetail);
  }

  public async checkManualQuantity({ cartItems }: CheckManualQuantity) {
    const productDetailIds = cartItems.map((e) => e.productDetailId);

    const productDetails = await this.productDetailRepo
      .createQueryBuilder(this.proDetailAlias)
      .where(`${this.proDetailAlias}.id IN (:...ids)`, { ids: productDetailIds })
      .cache(true, 10000)
      .select([`${this.proDetailAlias}.id`, `${this.proDetailAlias}.stock`])
      .getMany();

    const cartItemsMap = new Map(cartItems.map((item) => [String(item.productDetailId), item.quantity]));

    const productIdOutOfStock = productDetails
      .filter((product) => {
        const cartQuantity = cartItemsMap.get(String(product.id));
        return product.stock < cartQuantity;
      })
      .map((product) => product.id);

    return {
      productIds: productIdOutOfStock,
    };
  }
}
