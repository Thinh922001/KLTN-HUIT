import { BadGatewayException, Injectable } from '@nestjs/common';
import { paymentConfig } from '../../utils/contains';
import { UserEntity } from '../../entities';
import { TopUpDto } from './dto/top-up.dto';
import { createHmac } from 'crypto';
import axios from 'axios';
import { WalletsRepository } from '../../repositories/wallets.repository';
import { UserTransactionRepository } from '../../repositories/user-transaction.repository';
import { RedisService } from '../../service/redis';
import { MoMoResponse } from '../../types';

@Injectable()
export class TopUpService {
  redis: RedisService;
  constructor(
    private readonly walletRepository: WalletsRepository,
    private readonly userTransaction: UserTransactionRepository
  ) {
    this.redis = new RedisService();
  }

  async topUp(user: UserEntity, { amount }: TopUpDto) {
    let {
      accessKey,
      secretKey,
      orderInfo,
      partnerCode,
      redirectUrl,
      ipnUrl,
      requestType,
      extraData,
      orderGroupId,
      autoCapture,
      lang,
    } = paymentConfig;

    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;

    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;

    const signature = createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    let result;

    result = await axios(options);

    const transaction = await this.userTransaction.save(
      this.userTransaction.create({
        amount: Number(amount),
        status: 'Pending',
        paymentMethod: 'momo',
        user: { id: user.id },
      })
    );

    await this.redis.set(orderId, user.id, 60);
    await this.redis.set(`user::tran-${user.id}`, transaction.id, 60);
    return result.data;
  }

  async updateOrCreateWallet(userId: number, amount: number) {
    let wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!wallet) {
      wallet = this.walletRepository.create({
        user: { id: userId } as UserEntity,
        balance: amount,
      });
    } else {
      wallet.balance += amount;
    }

    await this.walletRepository.save(wallet);
  }

  async applyTopUp(data: MoMoResponse) {
    const userId: number = await this.redis.get(data.orderId);
    const transactionId: number = await this.redis.get(`user::tran-${userId}`);

    if (!userId) {
      throw new BadGatewayException('Có lỗi thanh toán xảy ra');
    }

    if (data.resultCode === 0) {
      await Promise.all([
        this.userTransaction.update(
          { id: transactionId, user: { id: userId } },
          {
            status: 'SUCCESS',
          }
        ),
        this.updateOrCreateWallet(userId, data.amount),
      ]);
    } else {
      await this.userTransaction.update(
        { id: transactionId, user: { id: userId } },
        {
          status: 'FAILURE',
        }
      );
    }
  }
}
