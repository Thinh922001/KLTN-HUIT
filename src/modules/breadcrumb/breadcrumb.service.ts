import { Injectable } from '@nestjs/common';
import { CateRepository, ProductRepository } from '../../repositories';
import { GetBreadCrumbDto } from './dto/get-breadcrumb.dto';
import { ProductsEntity } from '../../entities';
import { IBreadCrumb } from '../../vendors/types';
import { BaseBreadCrumb } from '../../utils/contains';

@Injectable()
export class BreadcrumbService {
  productAlias: string;
  constructor(private readonly cateRepo: CateRepository, private readonly productRepo: ProductRepository) {
    this.productAlias = ProductsEntity.name;
  }

  public async getBreadCrumb({ type, id }: GetBreadCrumbDto) {
    if (type === 'CATE') {
      const categoryPromise = this.cateRepo.findOne({ where: { id } });
      const productCountPromise = this.productRepo
        .createQueryBuilder(this.productAlias)
        .where(`${this.productAlias}.cate_id = :id`, { id })
        .getCount();

      const [cate, productCount] = await Promise.all([categoryPromise, productCountPromise]);

      if (!cate) {
        return [...BaseBreadCrumb];
      }

      const breadCrumb: IBreadCrumb = {
        name: `${productCount} ${cate.name}`,
      };

      return [...BaseBreadCrumb, breadCrumb];
    }

    return [];
  }
}
