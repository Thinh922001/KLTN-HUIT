import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
@Injectable()
export class SnsService {
  private snsClient: SNSClient;
  constructor() {
    this.snsClient = new SNSClient({
      region: 'ap-southeast-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  private formatPhoneNumber(phoneNumber: string): string {
    console.log(phoneNumber);
    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.startsWith('0')) {
      return `+84${cleaned.slice(1)}`;
    }
    return `+84${cleaned}`;
  }

  async sendSmsWithOtp(phoneNumber: string, otpCode: string): Promise<void> {
    const message = `Mã xác nhận của bạn là: ${otpCode}. Vui lòng không chia sẻ mã này với ai.`;

    try {
      const command = new PublishCommand({
        Message: message,
        PhoneNumber: this.formatPhoneNumber(phoneNumber),
      });

      await this.snsClient.send(command);
      console.log('SMS Sent:', message);
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('Could not send OTP SMS');
    }
  }
}
