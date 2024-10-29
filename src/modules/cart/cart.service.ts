import { BadRequestException, Injectable } from '@nestjs/common';
import { CartItemsRepository, CartRepository, ProductDetailsRepository } from '../../repositories';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartEntity, CartItemEntity, ProductDetailsEntity, ProductsEntity, UserEntity } from '../../entities';
import { CartDto } from './dto/cart.dto';
import { CheckManualQuantity } from './dto/check-manual-quantity.entity';
import { SyncCartDto } from './dto/sync-cart.dto';
import { ErrorMessage } from '../../common/message';
import { Transactional } from 'typeorm-transactional';
import { GetCartDto } from './dto/get-cart.dto';
import { DeleteCartDto } from './dto/delete.cart.dto';

@Injectable()
export class CartService {
  proDetailAlias: string;
  productAlias: string;
  cartAlias: string;
  cartItemsAlias: string;
  constructor(
    private readonly productDetailRepo: ProductDetailsRepository,
    private readonly cartRepo: CartRepository,
    private readonly cartItemsRepo: CartItemsRepository
  ) {
    this.proDetailAlias = ProductDetailsEntity.name;
    this.productAlias = ProductsEntity.name;
    this.cartAlias = CartEntity.name;
    this.cartItemsAlias = CartItemEntity.name;
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

  @Transactional()
  public async syncCart(user: UserEntity, { carts }: SyncCartDto) {
    const cartMap = new Map(carts.map((e) => [e.id, e]));

    const productDetails = await this.productDetailRepo
      .createQueryBuilder(this.proDetailAlias)
      .where(`${this.proDetailAlias}.id IN (:...ids)`, { ids: Array.from(cartMap.keys()) })
      .select([`${this.proDetailAlias}.id`, `${this.proDetailAlias}.price`, `${this.proDetailAlias}.stock`])
      .getMany();

    if (productDetails.length !== carts.length) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    const productDetailMap = new Map(productDetails.map((item) => [item.id, item]));

    const cart = await this.getCartByOwner(user.id);

    if (!cart) {
      const newCart = this.cartRepo.create({ customer: { id: user.id } });
      newCart.total_price = productDetails.reduce((acc, item) => {
        const cartItem = cartMap.get(item.id);
        return acc + (cartItem?.quantity ?? 0) * item.price;
      }, 0);

      const savedCart = await this.cartRepo.save(newCart);

      const cartItemsEntities = productDetails.map((item) => {
        const cartItem = cartMap.get(item.id);
        return this.cartItemsRepo.create({
          sku: { id: item.id },
          quantity: cartItem.quantity,
          unit_price: item.price,
          total_price: +item.price * cartItem.quantity,
          cart: { id: savedCart.id },
        });
      });

      await this.cartItemsRepo.save(cartItemsEntities);
    } else {
      cart.cart_items.forEach((item) => {
        const cartItem = cartMap.get(item.sku.id);
        if (cartItem) {
          item.quantity = cartItem.quantity;
          item.total_price = cartItem.quantity * +item.unit_price;
          cartMap.delete(item.sku.id);
        }
      });

      const newCartItems = Array.from(cartMap.values()).map((cartItem) => {
        const product = productDetailMap.get(cartItem.id);
        return this.cartItemsRepo.create({
          sku: { id: cartItem.id },
          quantity: cartItem.quantity,
          unit_price: product.price,
          total_price: +cartItem.quantity * product.price,
          cart: { id: cart.id },
        });
      });

      if (newCartItems.length > 0) {
        await this.cartItemsRepo.save(newCartItems);
      }

      cart.total_price =
        cart.cart_items.reduce((acc, item) => acc + +item.total_price, 0) +
        newCartItems.reduce((acc, item) => acc + +item.total_price, 0);
      await this.cartRepo.save(cart);
    }

    return [];
  }

  public async getCart(user: UserEntity) {
    const cartItems = await this.cartItemsRepo
      .createQueryBuilder(this.cartItemsAlias)
      .withDeleted()
      .leftJoin(`${this.cartItemsAlias}.sku`, this.proDetailAlias)
      .leftJoin(`${this.proDetailAlias}.product`, this.productAlias)
      .leftJoin(`${this.cartItemsAlias}.cart`, this.cartAlias)
      .where(`${this.cartAlias}.customer_id =:userId`, { userId: user.id })
      .select([
        `${this.cartItemsAlias}.id`,
        `${this.cartItemsAlias}.quantity`,
        `${this.cartItemsAlias}.total_price`,
        `${this.cartItemsAlias}.unit_price`,
        `${this.proDetailAlias}.id`,
        `${this.proDetailAlias}.oldPrice`,
        `${this.proDetailAlias}.variationDetails`,
        `${this.proDetailAlias}.stock`,
        `${this.productAlias}.id`,
        `${this.productAlias}.img`,
        `${this.productAlias}.productName`,
      ])
      .getMany();

    return cartItems.map((e) => new GetCartDto(e));
  }

  public async getCartByOwner(userId: number) {
    return await this.cartRepo
      .createQueryBuilder(this.cartAlias)
      .where(`${this.cartAlias}.customer_id = :userId`, { userId })
      .leftJoinAndSelect(`${this.cartAlias}.cart_items`, this.cartItemsAlias)
      .leftJoinAndSelect(`${this.cartItemsAlias}.sku`, this.proDetailAlias)
      .select([
        `${this.cartAlias}.id`,
        `${this.cartAlias}.total_price`,
        `${this.cartItemsAlias}.id`,
        `${this.cartItemsAlias}.quantity`,
        `${this.cartItemsAlias}.unit_price`,
        `${this.cartItemsAlias}.total_price`,
        `${this.proDetailAlias}.id`,
      ])
      .getOne();
  }

  @Transactional()
  public async deleteCart(user: UserEntity, { skuId }: DeleteCartDto) {
    const productDetails = await this.productDetailRepo
      .createQueryBuilder(this.proDetailAlias)
      .where(`${this.proDetailAlias}.id =:skuId`, { skuId })
      .select([`${this.proDetailAlias}.id`, `${this.proDetailAlias}.price`, `${this.proDetailAlias}.stock`])
      .getOne();

    if (!productDetails) {
      throw new BadRequestException(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    const cart = await this.getCartByOwner(user.id);

    if (!cart) {
      throw new BadRequestException(ErrorMessage.CART_NOT_FOUND);
    }

    const cartItemsDelete = cart.cart_items.find((e) => e.sku.id === skuId);

    if (cartItemsDelete) {
      cart.total_price = +cart.total_price - +cartItemsDelete.total_price;
      const { cart_items, customer, customer_id, ...cartSaved } = cart;
      await Promise.all([this.cartRepo.save(cartSaved), this.cartItemsRepo.delete({ id: cartItemsDelete.id })]);
    }

    return [];
  }
}
