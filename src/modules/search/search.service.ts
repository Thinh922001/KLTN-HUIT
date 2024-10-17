import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../repositories';
import { SearchProductDto } from './dto/search-product.dto';
import { BrandEntity, CateEntity, ProductsEntity } from '../../entities';
import { SearchProductResponse } from './dto/search-product-response';

@Injectable()
export class SearchService {
  productAlias: string;
  brandAlias: string;
  cateALias: string;
  constructor(private readonly productRepo: ProductRepository) {
    this.productAlias = ProductsEntity.name;
    this.brandAlias = BrandEntity.name;
    this.cateALias = CateEntity.name;
  }

  async searchProduct({ keyWord, take = 5 }: SearchProductDto) {
    if (!keyWord || keyWord.trim() === '') {
      return [];
    }

    const sanitizedKeyWord = keyWord.trim();

    const likeKeyword = `%${sanitizedKeyWord}%`;

    const booleanKeyword = `+${sanitizedKeyWord}*`;

    const productQuery = this.productRepo
      .createQueryBuilder(this.productAlias)
      .where(`MATCH(${this.productAlias}.productName) AGAINST(:keyWord IN BOOLEAN MODE)`, { keyWord: booleanKeyword })

      .andWhere(`${this.productAlias}.productName LIKE :likeKeyWord`, {
        likeKeyWord: likeKeyword,
      })
      .select([
        `${this.productAlias}.id`,
        `${this.productAlias}.productName`,
        `${this.productAlias}.createdAt`,
        `${this.productAlias}.img`,
        `${this.productAlias}.price`,
        `${this.productAlias}.oldPrice`,
      ])
      .orderBy(`${this.productAlias}.createdAt`, 'DESC')
      .take(take);

    const results = await productQuery.getMany();

    if (results.length > 0) {
      return results.map((e) => new SearchProductResponse(e));
    }

    const productCombinedCateQuery = await this.productRepo
      .createQueryBuilder(this.productAlias)
      .leftJoin(`${this.productAlias}.cate`, this.cateALias)
      .where(`${this.cateALias}.name LIKE :likeKeyword`, { likeKeyword })
      .select([
        `${this.productAlias}.id`,
        `${this.productAlias}.productName`,
        `${this.productAlias}.createdAt`,
        `${this.productAlias}.img`,
        `${this.productAlias}.price`,
        `${this.productAlias}.oldPrice`,
      ])
      .orderBy(`${this.productAlias}.createdAt`, 'DESC')
      .take(take)
      .getMany();

    return productCombinedCateQuery.map((e) => new SearchProductResponse(e));
  }
}
