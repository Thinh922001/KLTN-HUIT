import { Module } from '@nestjs/common';
import { CateTypeController } from './cate-type.controller';
import { CateTypeService } from './cate-type.service';
import { CateTypeRepository } from '../../repositories';

@Module({
  providers: [CateTypeService, CateTypeRepository],
  controllers: [CateTypeController],
})
export class CateTypeModule {}
