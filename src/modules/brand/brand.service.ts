import { Injectable } from '@nestjs/common';
import { BrandRepository } from '../../repositories';
import { GetBrandByCateDto } from './dto/get-brand-cate.dto';
import { BrandEntity, ProductsEntity } from '../../entities';

@Injectable()
export class BrandService {
  entityAlias: string;
  productAlias: string;
  constructor(private readonly brandRepo: BrandRepository) {
    this.entityAlias = BrandEntity.name;
    this.productAlias = ProductsEntity.name;
  }

  public async getBrandByCate({ cateId }: GetBrandByCateDto) {
    const data = await this.brandRepo
      .createQueryBuilder(this.entityAlias)
      .innerJoin(`${this.entityAlias}.products`, this.productAlias)
      .where(`${this.productAlias}.cate_id = :cateId`, { cateId })
      .select([`${this.entityAlias}.id`, `${this.entityAlias}.name`])
      .getMany();

    return data;
  }
}
