import { IsNotEmpty, IsNumberString } from 'class-validator';
import { OrderEntity } from '../../../entities';
import { formatDateTimeToVietnamTimezone } from '../../../utils/date';

export class GetOrderDetail {
  @IsNumberString()
  @IsNotEmpty()
  orderId: number;
}

export class Item {
  name: string;
  img: string;
  quantity: number;
  totalAmount: number;
  price: number;
  oldPrice: number;
}

export class GetOrderResponse {
  id: number;
  name: string;
  createdAt: string;
  receiveDate: string;
  receiveAt: string;
  totalAmount: number;
  finalAmount: number;
  addressRecieve: string;
  items: Item[];

  constructor(orderEntity: OrderEntity) {
    const gender = orderEntity.customer.gender === 'male' ? 'Anh' : 'Chị';
    this.name = `${gender} ${orderEntity.customer.name} - ${
      orderEntity.customer?.phone ? orderEntity.customer?.phone : ''
    }`;
    this.addressRecieve = orderEntity.shipping_address;
    this.id = orderEntity.id;
    this.createdAt = formatDateTimeToVietnamTimezone(orderEntity.createdAt.toISOString());
    this.receiveDate = formatDateTimeToVietnamTimezone(orderEntity.updatedAt.toISOString());
    this.createdAt = orderEntity.shipping_address;
    this.totalAmount = orderEntity.orderDetails.reduce<number>((acc, item) => acc + Number(item.total_price), 0);
    this.finalAmount = orderEntity.total_amount;
    this.items = orderEntity.orderDetails.map((e) => {
      const color =
        e.sku.variationDetails &&
        e.sku.variationDetails['color'] !== undefined &&
        e.sku.variationDetails['color'] !== null
          ? String(e.sku.variationDetails['color'])
          : '';

      return {
        name: `${e.sku.product.productName} ${color}`,
        img: e.sku.product.img,
        quantity: e.quantity,
        totalAmount: e.total_price,
        price: e.sku.price,
        oldPrice: e.sku.oldPrice,
      };
    });
  }
}
