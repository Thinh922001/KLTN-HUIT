import { Injectable } from '@nestjs/common';
import { ProvinceRepository, WardRepository, DistrictRepository } from '../../repositories';

import axios from 'axios';

@Injectable()
export class ProvinceService {
  constructor(private readonly provinceRepo: ProvinceRepository) {}

  public async getProvince() {
    return await this.provinceRepo.find({ select: ['id', 'name'] });
  }
}
