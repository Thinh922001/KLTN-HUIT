import { Injectable } from '@nestjs/common';
import { CateRepository, ProductRepository } from '../../repositories';
import { CreateCateDto } from './dto/create-cate.dto';
import { CateEntity, ProductsEntity } from '../../entities';
import { UpdateCateDto } from './dto/update-cate.dto';
import { Transactional } from 'typeorm-transactional';
import { BadRequestException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { convertHttpToHttps } from '../../utils/utils';
import { GetAllCateDto } from './dto/get-all-cate.dto';

@Injectable()
export class CategoryService {
  cateAlias: string;
  productAlias: string;
  constructor(private readonly cateRepo: CateRepository, private readonly productRepo: ProductRepository) {
    this.cateAlias = CateEntity.name;
    this.productAlias = ProductsEntity.name;
  }

  async createCate({ name, cateTypeId }: CreateCateDto) {
    return await this.cateRepo.save(this.cateRepo.create({ name, cateType: { id: cateTypeId } }));
  }

  async getAllCate(body: GetAllCateDto) {
    const query = this.cateRepo
      .createQueryBuilder(this.cateAlias)
      .select([`${this.cateAlias}.id`, `${this.cateAlias}.name`, `${this.cateAlias}.img`]);

    if (body.cateTypeId) {
      query.andWhere(`${this.cateAlias}.cate_type_id =:cateTypeId`, { cateTypeId: body.cateTypeId });
    }

    return await query.getMany();
  }

  @Transactional()
  async updateCate({ cateId, name, cateTypeId }: UpdateCateDto) {
    const updateData: any = { name };
    if (cateTypeId) {
      updateData.cateType = { id: cateTypeId };
    }

    return await this.cateRepo.update(cateId, updateData);
  }

  @Transactional()
  async deleteCate(cateId: number) {
    const hasExist = await this.productRepo.exist({ where: { cate: { id: cateId } } });

    if (hasExist) {
      throw new BadRequestException(ErrorMessage.CATEGORY_CANNOT_DELETE);
    }

    return await this.cateRepo.delete(cateId);
  }

  public async getCateById(cateId: number) {
    const product = await this.cateRepo.findOne({
      where: { id: cateId },
      select: ['id'],
    });

    if (!product) throw new Error('Cate not Found');
    return product;
  }

  public async updateCateUser(id: number, updateData: Partial<CateEntity>): Promise<CateEntity> {
    await this.cateRepo.update(id, updateData);
    return await this.cateRepo.findOne({ where: { id } });
  }

  async getAllCateUser() {
    const subQuery = this.productRepo
      .createQueryBuilder(`${this.productAlias}sub`)
      .select('1')
      .where(`${this.productAlias}sub.cate_id = ${this.cateAlias}.id`);

    const query = this.cateRepo
      .createQueryBuilder(this.cateAlias)
      .select([`${this.cateAlias}.id`, `${this.cateAlias}.name`, `${this.cateAlias}.img`])
      .andWhere(`EXISTS (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .cache(60);

    const data = await query.getMany();

    return data.map((e) => ({
      ...e,
      img: e.img ? convertHttpToHttps(e.img) : null,
    }));
  }
}
