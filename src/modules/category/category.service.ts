import { Injectable } from '@nestjs/common';
import { CateRepository, ProductRepository } from '../../repositories';
import { CreateCateDto } from './dto/create-cate.dto';
import { CateEntity } from '../../entities';
import { UpdateCateDto } from './dto/update-cate.dto';
import { Transactional } from 'typeorm-transactional';
import { BadRequestException } from '../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../common/message';
import { convertHttpToHttps } from '../../utils/utils';

@Injectable()
export class CategoryService {
  cateAlias: string;
  constructor(private readonly cateRepo: CateRepository, private readonly productRepo: ProductRepository) {
    this.cateAlias = CateEntity.name;
  }

  async createCate({ name }: CreateCateDto) {
    return await this.cateRepo.save(this.cateRepo.create({ name }));
  }

  async getAllCate() {
    return await this.cateRepo
      .createQueryBuilder(this.cateAlias)
      .select([`${this.cateAlias}.id`, `${this.cateAlias}.name`, `${this.cateAlias}.img`])
      .getMany();
  }

  @Transactional()
  async updateCate({ cateId, name }: UpdateCateDto) {
    return await this.cateRepo.update(cateId, {
      name: name,
    });
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
    return (
      await this.cateRepo
        .createQueryBuilder(this.cateAlias)
        .select([`${this.cateAlias}.id`, `${this.cateAlias}.name`, `${this.cateAlias}.img`])
        .getMany()
    ).map((e) => {
      return {
        ...e,
        img: convertHttpToHttps(e.img),
      };
    });
  }
}
