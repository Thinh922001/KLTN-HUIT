import { Injectable } from '@nestjs/common';
import { Bannerpository } from '../../repositories';
import { UploadApiResponse } from 'cloudinary';
import { BannerEntity } from '../../entities';
import { convertHttpToHttps } from '../../utils/utils';

@Injectable()
export class BannerService {
  bannerAlias: string;
  constructor(private readonly bannerRepo: Bannerpository) {
    this.bannerAlias = BannerEntity.name;
  }

  async createBanner(uploadResults: UploadApiResponse[]) {
    if (uploadResults.length) {
      const banner = uploadResults.map((e) =>
        this.bannerRepo.create({ img: convertHttpToHttps(e.url), publicId: e.public_id })
      );
      await this.bannerRepo.save(banner);
    }
  }

  async getPublicId(bannerId: number[]): Promise<string[]> {
    const data = await this.bannerRepo
      .createQueryBuilder(this.bannerAlias)
      .select([`${this.bannerAlias}.publicId`])
      .where(`${this.bannerAlias}.id IN (:...bannerId)`, { bannerId })
      .getMany();

    if (!data || !data.length) return [];
    return data.map((e) => e.publicId);
  }

  async getAllBanner(): Promise<string[]> {
    const data = await this.bannerRepo
      .createQueryBuilder(this.bannerAlias)
      .select([`${this.bannerAlias}.img`])
      .cache(true)
      .getMany();

    return data.length ? data.map((e) => e.img) : [];
  }

  async getAllBannerAdmin() {
    return await this.bannerRepo
      .createQueryBuilder(this.bannerAlias)
      .select([`${this.bannerAlias}.id`, `${this.bannerAlias}.img`])
      .getMany();
  }
}
