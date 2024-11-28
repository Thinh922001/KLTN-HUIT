import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { TIME_ZONE } from '../../utils/date';

@Injectable()
export class CronService {
  constructor(private readonly productService: ProductService, private readonly dataSource: DataSource) {}

  @Cron('0 0 * * *', {
    timeZone: TIME_ZONE,
  })
  async refreshCache() {
    console.log('Chạy cron job để clear cache và ghi đè cache mới.');

    try {
      if (this.dataSource.queryResultCache) {
        await this.dataSource.queryResultCache.remove(['random_products_cache']);
        console.log('Cache "random_products_cache" đã được clear.');
      }

      const products = await this.productService.getRandomProduct();

      if (!products || !Array.isArray(products)) {
        console.error('Lỗi: Kết quả từ getRandomProduct không hợp lệ:', products);
        return;
      }

      console.log(`Đã refresh cache với ${products.length} sản phẩm.`);
    } catch (error) {
      console.error('Lỗi trong refreshCache:', error);
    }
  }
}
