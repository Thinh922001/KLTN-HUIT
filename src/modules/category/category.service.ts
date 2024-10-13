import { Injectable } from '@nestjs/common';
import { CateRepository } from '../../repositories';
import { CreateCateDto } from './dto/create-cate.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly cateRepo: CateRepository) {}

  async createCate({ name }: CreateCateDto) {
    return await this.cateRepo.save(this.cateRepo.create({ name }));
  }
}
