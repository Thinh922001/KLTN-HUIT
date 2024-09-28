import { Injectable } from '@nestjs/common';
import { WardRepository } from '../../repositories';
import { DistrictEntity, WardEntity } from '../../entities';

@Injectable()
export class WardService {
  entityAlias: string;
  districtsAlias: string;
  constructor(private readonly wardRepo: WardRepository) {
    this.entityAlias = WardEntity.name;
    this.districtsAlias = DistrictEntity.name;
  }

  async getWardService(districtId: number) {
    return await this.wardRepo
      .createQueryBuilder(this.entityAlias)
      .leftJoinAndSelect(`${this.entityAlias}.district`, this.districtsAlias)
      .where(`${this.districtsAlias}.id = :districtId`, { districtId })
      .select([`${this.entityAlias}.id`, `${this.entityAlias}.name`])
      .getMany();
  }
}
