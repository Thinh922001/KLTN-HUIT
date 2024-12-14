export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum ReactionType {
  LIKE = 'LIKE',
}

export enum ShippingMethod {
  /**
   * Standard Shipping: Giao hàng tiêu chuẩn,
   * thường có thời gian giao hàng trung bình.
   */
  STANDARD = 'Standard Shipping',

  /**
   * Express Shipping: Giao hàng nhanh với thời gian giao hàng ngắn hơn,
   * nhưng có thể tốn phí cao hơn.
   */
  EXPRESS = 'Express Shipping',

  /**
   * Overnight Shipping: Giao hàng qua đêm,
   * đảm bảo đơn hàng sẽ đến vào ngày hôm sau.
   */
  OVERNIGHT = 'Overnight Shipping',

  /**
   * Pickup: Khách hàng tự đến lấy tại một địa điểm cụ thể
   * (ví dụ: cửa hàng hoặc kho hàng).
   */
  PICKUP = 'Pickup',

  /**
   * Economy Shipping: Phương thức giao hàng tiết kiệm,
   * thời gian giao hàng dài hơn nhưng chi phí thấp hơn.
   */
  ECONOMY = 'Economy Shipping',
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Returned = 'Returned',
  Canceled = 'Canceled',
  Completed = 'Completed',
}

export interface MoMoResponse {
  partnerCode: 'MOMO';
  orderId: string;
  requestId: string;
  amount: number;
  orderInfo: string;
  orderType: 'momo_wallet';
  transId: number;
  resultCode: number;
  message: string;
  payType: 'qr';
  responseTime: number;
  extraData: string;
  signature: string;
}

export enum OrderReturnStatus {
  Pending = 'Pending',
  Resolved = 'Resolve',
  Rejected = 'Rejected',
}
