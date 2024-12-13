import { Injectable } from '@nestjs/common';
import { CateTypeRepository } from '../../repositories';
import { CateEntity, CategoryTypeEntity } from '../../entities';
import { CreateCateTypeDto, UpdateCateTypeDto } from './dto/creae-cate-type.dto';
import { convertHttpToHttps } from 'src/utils/utils';

@Injectable()
export class CateTypeService {
  cateTypeAlias: string;
  cateAlias: string;
  constructor(private readonly cateTypeRepo: CateTypeRepository) {
    this.cateTypeAlias = CategoryTypeEntity.name;
    this.cateAlias = CateEntity.name;
  }

  async getCateTypeUser() {
    const data = await this.cateTypeRepo
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

    return data.length
      ? data.map((e) => {
          const updatedCategory = e.category.map((category) => {
            if (category.img) {
              category.img = convertHttpToHttps(category.img);
            }
            return category;
          });

          return {
            ...e,
            category: updatedCategory,
          };
        })
      : [];
  }

  async getCateTypeAdmin() {
    const data = await this.cateTypeRepo
      .createQueryBuilder(this.cateTypeAlias)
      .withDeleted()
      .leftJoin(`${this.cateTypeAlias}.category`, this.cateAlias)
      .select([
        `${this.cateTypeAlias}.id`,
        `${this.cateTypeAlias}.deletedAt`,
        `${this.cateTypeAlias}.name`,
        `${this.cateAlias}.id`,
        `${this.cateAlias}.deletedAt`,
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
