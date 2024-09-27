export class BaseException<T = any> extends Error {
  errorCode: string;
  details: T;
  constructor(errorCode: string, message: string, details?: T) {
    super();
    this.details = details || null;
    this.message = message;
    this.errorCode = errorCode;
  }
}
