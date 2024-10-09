import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories';
import { CateEntity, LabelEntity, LabelProductEntity, ProductsEntity } from '../../entities';
import { GetCateDto, IOrderBy, ISearch } from '../category/dto/cate.dto';
import { ProductDto } from './dto/product.dto';
import { applyPagination, convertAnyTo } from '../../utils/utils';
import { SelectQueryBuilder } from 'typeorm';

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
  public async getProductByCate({ cateId, take, skip, orderBy, filters }: GetCateDto) {
    const query = this.productRepo
      .createQueryBuilder(this.entityAlias)
      .innerJoinAndSelect(
        `${this.entityAlias}.labelProducts`,
        this.labelProductAlias,
        `${this.labelProductAlias}.product_id = ${this.entityAlias}.id`
      )
      .innerJoinAndSelect(`${this.labelProductAlias}.label`, this.labelAlias)
      .where(`${this.entityAlias}.cate_id = :cateId`, { cateId })
      .cache(true)
      .select([
        `${this.entityAlias}.id`,
        `${this.entityAlias}.createdAt`,
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

    if (orderBy) {
      this.applyOrderBy(query, orderBy);
    }

    if (filters) {
      this.applyFilters(query, filters);
    }

    const { data, paging } = await applyPagination<ProductsEntity>(query, take, skip);

    const result: ProductDto[] = data.map((e) => new ProductDto(e));

    return {
      data: result,
      paging: paging,
    };
  }

  private applyOrderBy(query: SelectQueryBuilder<any>, orderBy: IOrderBy) {
    if (orderBy) {
      const obj: IOrderBy = convertAnyTo<IOrderBy>(orderBy);
      const orderFields = [
        { key: 'trend', column: `${this.entityAlias}.starRate` },
        { key: 'well-sell', column: `${this.entityAlias}.totalVote` },
        { key: 'discount', column: `${this.entityAlias}.discountPercent` },
        { key: 'new', column: `${this.entityAlias}.createdAt` },
        { key: 'price', column: `${this.entityAlias}.price` },
      ];

      orderFields.forEach(({ key, column }, index) => {
        if (obj[key]) {
          if (index === 0) {
            query.orderBy(column, obj[key]);
          } else {
            query.addOrderBy(column, obj[key]);
          }
        }
      });
    }
  }

  private applyFilters(query: SelectQueryBuilder<any>, filters: ISearch) {
    if (filters) {
      const obj: ISearch = convertAnyTo<ISearch>(filters);
      const brandFilter = obj['brand'];
      if (Array.isArray(brandFilter) && brandFilter.length > 0) {
        query.andWhere(`${this.entityAlias}.brand_id IN (:...ids)`, { ids: brandFilter });
      }
    }
  }
}
