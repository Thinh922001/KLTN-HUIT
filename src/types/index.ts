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
  /**
   * Pending: Đơn hàng đang chờ xử lý, chưa được xác nhận.
   */
  PENDING = 'Pending',

  /**
   * Confirmed: Đơn hàng đã được xác nhận bởi hệ thống hoặc nhân viên.
   */
  CONFIRMED = 'Confirmed',

  /**
   * Shipped: Đơn hàng đã được giao cho đơn vị vận chuyển
   * và đang trên đường đến khách hàng.
   */
  SHIPPED = 'Shipped',

  /**
   * Delivered: Đơn hàng đã được giao thành công đến khách hàng.
   */
  DELIVERED = 'Delivered',

  /**
   * Cancelled: Đơn hàng đã bị hủy bởi khách hàng hoặc hệ thống.
   */
  CANCELLED = 'Cancelled',

  /**
   * Returned: Đơn hàng đã được trả lại sau khi giao cho khách hàng.
   */
  RETURNED = 'Returned',

  /**
   * Refunded: Đơn hàng đã được hoàn tiền cho khách hàng (nếu phù hợp).
   */
  REFUNDED = 'Refunded',
}
