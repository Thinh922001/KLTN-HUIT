import { Module } from '@nestjs/common';
import { UserTransactionRepository } from '../../repositories/user-transaction.repository';
import { WalletsRepository } from '../../repositories/wallets.repository';
import { TopUpController } from './top-up.controller';
import { TopUpService } from './top-up.service';

@Module({
  providers: [TopUpService, UserTransactionRepository, WalletsRepository],
  controllers: [TopUpController],
})
export class TopUpModule {}
