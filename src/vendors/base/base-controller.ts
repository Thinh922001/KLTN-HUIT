type ResponseOption = {
  statusCode: number;
  message: string;
};
export class BaseController {
  protected statusCode: number;
  protected message: string;
  constructor() {
    this.statusCode = 200;
    this.message = 'Success';
  }

  /**
   * Transform all data from controller
   */
  response<T>(data: T, options?: ResponseOption) {
    const { statusCode, message } = options || {};
    return {
      statusCode: statusCode ? statusCode : this.statusCode,
      message: message ? message : this.message,
      data: data,
    };
  }
}
