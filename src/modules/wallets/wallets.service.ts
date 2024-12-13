import { Injectable } from '@nestjs/common';
import { WalletsRepository } from '../../repositories/wallets.repository';
import { WalletsEntity } from '../../entities/wallets.entity';

@Injectable()
export class WalletsService {
  walletAlias: string;
  constructor(private readonly walletRepo: WalletsRepository) {
    this.walletAlias = WalletsEntity.name;
  }

  async getUserWallet(userId: number) {
    const wallet = await this.walletRepo
      .createQueryBuilder(this.walletAlias)
      .where(`${this.walletAlias}.user_id =:userId`, { userId })
      .select([`${this.walletAlias}.balance`])
      .getOne();

    return wallet ? { balance: Number(wallet.balance) } : { balance: 0 };
  }
}
