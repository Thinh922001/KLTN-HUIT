import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { WalletsRepository } from '../../repositories/wallets.repository';

@Module({
  providers: [WalletsService, WalletsRepository],
  controllers: [WalletsController],
})
export class WalletsModule {}
