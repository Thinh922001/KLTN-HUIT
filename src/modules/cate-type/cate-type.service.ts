import { Injectable } from '@nestjs/common';
import { CateTypeRepository } from '../../repositories';
import { CateEntity, CategoryTypeEntity } from '../../entities';
import { CreateCateTypeDto, UpdateCateTypeDto } from './dto/creae-cate-type.dto';

@Injectable()
export class CateTypeService {
  cateTypeAlias: string;
  cateAlias: string;
  constructor(private readonly cateTypeRepo: CateTypeRepository) {
    this.cateTypeAlias = CategoryTypeEntity.name;
    this.cateAlias = CateEntity.name;
  }

  async getCateTypeUser() {
    const data = this.cateTypeRepo
      .createQueryBuilder(this.cateTypeAlias)
      .leftJoin(`${this.cateTypeAlias}.category`, this.cateAlias)
      .cache(true)
      .select([
        `${this.cateTypeAlias}.id`,
        `${this.cateTypeAlias}.name`,
        `${this.cateAlias}.id`,
        `${this.cateAlias}.name`,
        `${this.cateAlias}.img`,
      ])
      .getMany();
    return data;
  }

  async getCateTypeAdmin() {
    const data = this.cateTypeRepo
      .createQueryBuilder(this.cateTypeAlias)
      .withDeleted()
      .leftJoin(`${this.cateTypeAlias}.category`, this.cateAlias)
      .select([
        `${this.cateTypeAlias}.id`,
        `${this.cateTypeAlias}.deleted_at`,
        `${this.cateTypeAlias}.name`,
        `${this.cateAlias}.id`,
        `${this.cateAlias}.deleted_at`,
        `${this.cateAlias}.name`,
        `${this.cateAlias}.img`,
      ])
      .getMany();
    return data;
  }

  async createCateType({ name }: CreateCateTypeDto) {
    return await this.cateTypeRepo.save(this.cateTypeRepo.create({ name }));
  }

  async updateCateType({ id, name }: UpdateCateTypeDto) {
    return await this.cateTypeRepo.update(id, {
      name: name,
    });
  }

  async deleteCateType(cateTypeId: number) {
    return await this.cateTypeRepo.softDelete(cateTypeId);
  }
}
