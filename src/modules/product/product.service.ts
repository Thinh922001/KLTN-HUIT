import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories';
import { CateEntity, LabelEntity, LabelProductEntity, ProductsEntity } from '../../entities';
import { GetCateDto } from '../category/dto/cate.dto';
import { ProductDto } from './dto/product.dto';
import { PagingDto } from '../../vendors/dto/pager.dto';

@Injectable()
export class ProductService {
  entityAlias: string;
  cateAlias: string;
  labelProductAlias: string;
  labelAlias: string;
  constructor(private readonly productRepo: ProductRepository) {
    this.entityAlias = ProductsEntity.name;
    this.cateAlias = CateEntity.name;
    this.labelProductAlias = LabelProductEntity.name;
    this.labelAlias = LabelEntity.name;
  }
  public async getProductByCate({ cateId, take, skip }: GetCateDto) {
    const query = this.productRepo
      .createQueryBuilder(this.entityAlias)
      .innerJoin(`${this.entityAlias}.cate`, this.cateAlias, `${this.cateAlias}.id = ${this.entityAlias}.cate_id`)
      .leftJoinAndSelect(
        `${this.entityAlias}.labelProducts`,
        this.labelProductAlias,
        `${this.labelProductAlias}.product_id = ${this.entityAlias}.id`
      )
      .leftJoinAndSelect(`${this.labelProductAlias}.label`, this.labelAlias)
      .where(`${this.entityAlias}.cate_id = :cateId`, { cateId })
      .take(take)
      .skip(skip)
      .select([
        `${this.entityAlias}.id`,
        `${this.entityAlias}.productName`,
        `${this.entityAlias}.img`,
        `${this.entityAlias}.textOnlineType`,
        `${this.entityAlias}.tabs`,
        `${this.entityAlias}.totalVote`,
        `${this.entityAlias}.starRate`,
        `${this.entityAlias}.price`,
        `${this.entityAlias}.oldPrice`,
        `${this.entityAlias}.discountPercent`,
        `${this.labelProductAlias}.id`,
        `${this.labelAlias}.text`,
        `${this.labelAlias}.type`,
      ]);

    const itemCount = await query.getCount();

    const { entities } = await query.getRawAndEntities();

    const paging = new PagingDto(itemCount, { take, skip });

    const result: ProductDto[] = entities.map((e) => new ProductDto(e));

    return {
      data: result,
      paging: paging,
    };
  }
}
