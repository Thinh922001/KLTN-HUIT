import { ReturnOrderEntity } from 'src/entities';

export class ReturnOrderResponse {
  id: number;
  status: string;
  isApprove: boolean;
  reason: string;
  quantity: number;
  returnPrice: number;
  phone: string;
  productName: string;

  constructor(entity: ReturnOrderEntity) {
    this.id = entity.id;
    this.status = entity.status;
    this.isApprove = entity.isApprove;
    this.reason = entity.reason;
    this.quantity = entity.quantity;
    const unitPriceProduct = entity.order.orderDetails.find((e) => e.sku.id === entity.producDetail.id);
    if (unitPriceProduct) {
      this.returnPrice = Number(unitPriceProduct.unit_price) * this.quantity;
    } else {
      this.returnPrice = Number(entity.producDetail.price) * this.quantity;
    }
    this.phone = entity.user.phone;
    this.productName = entity.producDetail.product.productName;
  }
}
