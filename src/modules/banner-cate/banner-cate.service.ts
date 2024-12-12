import { Injectable } from '@nestjs/common';
import { CateBannerRepository } from '../../repositories';
import { CateBannerEntity } from '../../entities';
import { UploadApiResponse } from 'cloudinary';
import { convertHttpToHttps } from '../../utils/utils';
import { In } from 'typeorm';

@Injectable()
export class BannerCateService {
  cateBannerAlias: string;
  constructor(private readonly bannerCaterepo: CateBannerRepository) {
    this.cateBannerAlias = CateBannerEntity.name;
  }

  async getCateBanner() {
    const data = await this.bannerCaterepo
      .createQueryBuilder(this.cateBannerAlias)
      .select([`${this.cateBannerAlias}.img`])
      .cache(true)
      .getMany();
    return data.length ? data.map((e) => e.img) : [];
  }

  async getCateBannerAdmin() {
    return await this.bannerCaterepo
      .createQueryBuilder(this.cateBannerAlias)
      .select([`${this.cateBannerAlias}.id`, `${this.cateBannerAlias}.img`])
      .getMany();
  }

  async createBanner(cateId: number, uploadResults: UploadApiResponse[]) {
    if (uploadResults.length) {
      const banner = uploadResults.map((e) =>
        this.bannerCaterepo.create({ img: convertHttpToHttps(e.url), publicId: e.public_id, cate: { id: cateId } })
      );
      await this.bannerCaterepo.save(banner);
    }
  }

  async getPublicId(bannerId: number[]): Promise<string[]> {
    const data = await this.bannerCaterepo
      .createQueryBuilder(this.cateBannerAlias)
      .select([`${this.cateBannerAlias}.publicId`])
      .where(`${this.cateBannerAlias}.id IN (:...bannerId)`, { bannerId })
      .getMany();

    if (!data || !data.length) return [];
    return data.map((e) => e.publicId);
  }

  async deleteBanner(imgId: number[]) {
    return await this.bannerCaterepo.delete({ id: In(imgId) });
  }
}
