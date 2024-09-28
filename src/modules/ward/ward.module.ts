import { Module } from '@nestjs/common';
import { WardController } from './ward.controller';
import { WardService } from './ward.service';
import { WardRepository } from '../../repositories';

@Module({
  controllers: [WardController],
  providers: [WardService, WardRepository],
})
export class WardModule {}
