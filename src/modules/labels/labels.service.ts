import { Injectable } from '@nestjs/common';
import { LabelRepository } from '../../repositories';
import { In } from 'typeorm';

@Injectable()
export class LabelsService {
  constructor(private readonly labelRepo: LabelRepository) {}
  async checkLabels(labelId: number[]) {
    const data = await this.labelRepo.find({ where: { id: In(labelId) }, select: ['id'] });
    return data.length === labelId.length;
  }
}
