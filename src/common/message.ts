export enum GenericErrorMessage {
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Not Found',
  BAD_REQUEST = 'Bad Request',
  FORBIDDEN = 'Forbidden',
  CONFLICT = 'Conflict',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export enum GenericErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export enum ErrorMessage {
  INVALID_USER = 'Invalid user',
  USER_EXISTED = 'User existed',
  EXPIRED_TOKEN = 'Token expired',
  INVALID_TOKEN = 'Invalid token',
  INVALID_REFRESH_TOKEN = 'Invalid refresh token',
  EXPIRED_REFRESH_TOKEN = 'Refresh token expired',
  NOT_BEFORE = 'Current time is before the nbf claim.',
  PHONE_NOT_EXIST = 'PHONE_NOT_EXIST',
  NOT_EXPIRED = 'NOT_EXPIRED',
  NEED_REQUEST_CODE = 'NEED_REQUEST_CODE',
  EXPIRED_DATE = 'EXPIRED_DATE',
  INVALID_CODE = 'INVALID_CODE',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CART_NOT_FOUND = 'CART_NOT_FOUND',
  COUPON_EXPIRED = 'COUPON_EXPIRED',
  COUPON_NOT_ACTIVE = 'COUPON_NOT_ACTIVE',
  EXCEEDED_COUPON = 'EXCEEDED_COUPON',
  INVALID_COUPON = 'INVALID_COUPON',
  SOLD_OUT = 'SOLD_OUT',
  INVALID_UPDATE_USER = 'No fields provided for update',
  INVALID_ADMIN = 'Invalid admin',
  INVALID_ADMIN_ROLE = 'Invalid admin role',
  ADMIN_EXISTED = 'Admin existed',
  ADMIN_DELETE_SELF = 'admin delete self',
  ORDER_STATUS_CANNOT_UPDATE = 'Order status cannot update',
  ORDER_STATUS_NOT_CHANGE = 'Order status not change',
  ORDER_NOT_FOUND = 'Order not found',
  CATEGORY_CANNOT_DELETE = 'Category cannot delete',
  Brand_CANNOT_DELETE = 'Brand cannot delete',
  COUPON_CANNOT_DELETE = 'Coupon cannot delete',
  ORDER_STATUS_INVALID = 'Order status invalid',
}

export function getErrorMessage(error: ErrorMessage, param?: string): string {
  return param ? `${error}: ${param}` : error;
}

export enum JsonWebTokenError {
  EXPIRED_TOKEN = 'TokenExpiredError',
  INVALID_TOKEN = 'JsonWebTokenError',
  NOT_BEFORE = 'NotBeforeError',
}
