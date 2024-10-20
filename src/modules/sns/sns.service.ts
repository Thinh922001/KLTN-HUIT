import { Injectable } from '@nestjs/common';

@Injectable()
export class SnsService {
  constructor() {}

  private formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.startsWith('0')) {
      return `+84${cleaned.slice(1)}`;
    }
    return `+84${cleaned}`;
  }
}
