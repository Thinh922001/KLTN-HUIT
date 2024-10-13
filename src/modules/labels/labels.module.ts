import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelRepository } from '../../repositories';

@Module({
  providers: [LabelsService, LabelRepository],
})
export class LabelsModule {}
