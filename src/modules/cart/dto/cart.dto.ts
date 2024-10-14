import { ProductDetailsEntity } from '../../../entities';

export class CartDto {
  productDetailId: number;
  img: string;
  price: number;
  oldPrice: number;
  quantity: number;

  constructor(productDetailEntity: ProductDetailsEntity) {
    this.productDetailId = productDetailEntity.id;
    if (productDetailEntity.product) {
      this.img = productDetailEntity.product.img;
    }
    this.price = productDetailEntity.price;
    this.oldPrice = productDetailEntity.oldPrice;
    this.quantity = 1;
  }
}
