import { ReturnOrderEntity } from '../../../entities';
import { convertHttpToHttps } from '../../../utils/utils';

export class ReturnOrderResponse {
  id: number;
  status: string;
  isApprove: boolean;
  reason: string;
  quantity: number;
  returnPrice: number;
  phone: string;
  productName: string;
  img: string[];

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
    if (entity.returnOrderImg.length > 0) {
      this.img = entity.returnOrderImg.map((e) => convertHttpToHttps(e.img));
    } else {
      this.img = [];
    }
    this.phone = entity.user.phone;
    this.productName = entity.producDetail.product.productName;
  }
}
