import { ProductDetailsEntity } from '../../../entities';

export class CartDto {
  productDetailId: number;
  productName: string;
  img: string;
  price: number;
  oldPrice: number;
  quantity: number;
  color: string;

  constructor(productDetailEntity: ProductDetailsEntity) {
    this.productDetailId = productDetailEntity.id;
    if (productDetailEntity.product) {
      this.img = productDetailEntity.product.img;
      this.productName = productDetailEntity.product.productName;
    }
    this.price = Number(productDetailEntity.price);
    this.oldPrice = Number(productDetailEntity.oldPrice);
    this.quantity = 1;
    this.color =
      productDetailEntity.variationDetails &&
      productDetailEntity.variationDetails['color'] !== undefined &&
      productDetailEntity.variationDetails['color'] !== null
        ? String(productDetailEntity.variationDetails['color'])
        : '';
  }
}
