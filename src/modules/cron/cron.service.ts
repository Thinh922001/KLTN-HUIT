import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { TIME_ZONE } from '../../utils/date';
import { StatisticService } from '../statistic/statistic.service';
import { MailService } from '../mail/mail.service';
import { AdminRepository } from '../../repositories/admin.repository';

@Injectable()
export class CronService {
  constructor(
    private readonly productService: ProductService,
    private readonly statsService: StatisticService,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
    private readonly adminRepo: AdminRepository
  ) {}

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

  @Cron('59 23 * * *', {
    timeZone: TIME_ZONE,
  })
  async reportDaily() {
    console.log('Đang tạo báo cáo doanh thu ngày...');

    // const today = new Date().toLocaleDateString('vi-VN');

    // const [day, month, year] = today.split('/').map(Number);

    // const [revenue, countRevenvue, topSelling] = await Promise.all([
    //   this.statsService.getRevenue({ mode: 'DAY', year, month, day }),
    //   this.statsService.countRevenueToday(),
    //   this.statsService.getTopSelling({ mode: 'DAY', year, month, day }),
    // ]);

    // const topSellingResult: { name: string; quantity: number; productDetailId: number }[] = topSelling.map((e) => {
    //   return {
    //     name:
    //       e.productName +
    //       (e.variationDetail && e.variationDetail['color'] ? ` ${String(e.variationDetail['color'])}` : ''),
    //     quantity: e.quantity,
    //     productDetailId: e.productDetailId,
    //   };
    // });

    // const admin = await this.adminRepo.find({ where: { roleName: 'SUPPER_ADMIN' } });
    // if (admin.length) {
    //   await this.mailService.sendDailyRevenueReport(
    //     admin.map((e) => e.email),
    //     {
    //       totalSales: revenue,
    //       totalOrders: countRevenvue,
    //       topSellingResult,
    //     }
    //   );
    // }

    console.log('Báo cáo doanh thu ngày thành công');
  }
}
