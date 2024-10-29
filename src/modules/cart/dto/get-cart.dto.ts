import { CartItemEntity } from 'src/entities';

export class GetCartDto {
  productDetailId: number;
  img: string;
  productName: string;
  price: number;
  oldPrice: number;
  quantity: number;
  color: string;
  hasNoStock: boolean;

  constructor(data: Partial<CartItemEntity>) {
    this.price = +data.unit_price;
    this.quantity = data.quantity;
    if (data.sku) {
      this.productDetailId = data.sku.id;
      this.img = data.sku.product.img;
      this.productName = data.sku.product.productName;
      this.oldPrice = +data.sku.oldPrice;
      this.color =
        data.sku.variationDetails &&
        data.sku.variationDetails['color'] !== undefined &&
        data.sku.variationDetails['color'] !== null
          ? String(data.sku.variationDetails['color'])
          : '';
      this.hasNoStock = data.quantity > data.sku.stock;
    }
  }
}
