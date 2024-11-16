import { Injectable } from '@nestjs/common';
import { BrandRepository, ProductRepository } from '../../repositories';
import { GetBrandByCateDto } from './dto/get-brand-cate.dto';
import { BrandEntity, ProductsEntity } from '../../entities';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BadRequestException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';

@Injectable()
export class BrandService {
  entityAlias: string;
  productAlias: string;
  constructor(private readonly brandRepo: BrandRepository, private readonly productRepo: ProductRepository) {
    this.entityAlias = BrandEntity.name;
    this.productAlias = ProductsEntity.name;
  }

  public async getBrandByCate({ cateId }: GetBrandByCateDto) {
    const data = await this.brandRepo
      .createQueryBuilder(this.entityAlias)
      .innerJoin(`${this.entityAlias}.products`, this.productAlias)
      .where(`${this.productAlias}.cate_id = :cateId`, { cateId })
      .select([`${this.entityAlias}.id`, `${this.entityAlias}.name`])
      .cache(true)
      .getMany();

    return data;
  }

  public async createBrand({ name }: CreateBrandDto) {
    return await this.brandRepo.save(this.brandRepo.create({ name }));
  }

  public async getAllBrand() {
    return await this.brandRepo
      .createQueryBuilder(this.entityAlias)
      .select([`${this.entityAlias}.id`, `${this.entityAlias}.name`])
      .getMany();
  }

  public async updateBrand({ brandId, name }: UpdateBrandDto) {
    return await this.brandRepo.update(brandId, {
      name: name,
    });
  }

  public async deleteBrand(brandId: number) {
    const hasUsed = await this.productRepo.exist({ where: { brand: { id: brandId } } });

    if (hasUsed) {
      throw new BadRequestException(ErrorMessage.Brand_CANNOT_DELETE);
    }

    return await this.brandRepo.delete(brandId);
  }
}
