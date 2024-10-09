import { Injectable } from '@nestjs/common';
import { DistrictRepository } from '../../repositories';
import { DistrictEntity, ProvinceEntity } from '../../entities';

@Injectable()
export class DistrictService {
  private entityAlias: string;
  private provinceAlias: string;
  constructor(private readonly districtRepo: DistrictRepository) {
    this.entityAlias = DistrictEntity.name;
    this.provinceAlias = ProvinceEntity.name;
  }

  public async getDistricts(id: number) {
    return await this.districtRepo
      .createQueryBuilder(this.entityAlias)
      .leftJoinAndSelect(`${this.entityAlias}.province`, this.provinceAlias)
      .where(`${this.provinceAlias}.id = :id`, { id })
      .cache(true)
      .select([`${this.entityAlias}.id`, `${this.entityAlias}.name`])
      .getMany();
  }
}
