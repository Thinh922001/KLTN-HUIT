import { ProductsEntity } from '../../../entities';

export class SearchProductResponse {
  id: number;
  productName: string;
  img: string;
  price: number;
  oldPrice: number;

  constructor(entity: ProductsEntity) {
    this.id = entity.id;
    this.productName = entity.productName;
    this.img = entity.img;
    this.price = entity.price;
    this.oldPrice = entity.oldPrice;
  }
}
