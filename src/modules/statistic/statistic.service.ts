import { Injectable } from '@nestjs/common';
import { getGroupByStats } from '../../utils/utils';
import { InvoiceEntity, OrderDetailEntity, OrderEntity, ProductDetailsEntity, ProductsEntity } from '../../entities';
import { InvoiceRepository } from '../../repositories';
import { GetLowSelling, Stats } from './dto/invoice-statistic.dto';
import { GetRevenue } from './dto/get-revenue.dto';

@Injectable()
export class StatisticService {
  entityAlias: string;
  orderAlias: string;
  orderDetailsAlias: string;
  productDetailAlias: string;
  productAlias: string;
  constructor(private readonly invoiceRepo: InvoiceRepository) {
    this.entityAlias = InvoiceEntity.name;
    this.orderAlias = OrderEntity.name;
    this.orderDetailsAlias = OrderDetailEntity.name;
    this.productDetailAlias = ProductDetailsEntity.name;
    this.productAlias = ProductsEntity.name;
  }

  public async getTopSelling({ mode, year, month, day, week, quarter, limit }: Stats): Promise<any> {
    const query = this.invoiceRepo
      .createQueryBuilder(this.entityAlias)
      .withDeleted()
      .leftJoin(`${this.entityAlias}.order`, this.orderAlias)
      .leftJoin(`${this.orderAlias}.orderDetails`, this.orderDetailsAlias)
      .leftJoin(`${this.orderDetailsAlias}.sku`, this.productDetailAlias)
      .leftJoin(`${this.productDetailAlias}.product`, this.productAlias)
      .where(`${this.entityAlias}.status = :status`, { status: 'PAID' })
      .select([
        `${this.productAlias}.product_name AS productName`,
        `${this.orderDetailsAlias}.product_detail_id AS productDetailId`,
        `${this.productDetailAlias}.variationDetails as variationDetail`,
        `${this.productAlias}.id as productId`,
        `SUM(${this.orderDetailsAlias}.quantity) AS quantity`,
      ])
      .groupBy(`${this.orderDetailsAlias}.product_detail_id`)
      .orderBy('quantity', 'DESC');

    if (mode === 'TODAY') {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`MONTH(${this.entityAlias}.created_at) = :month`, { month });
      query.andWhere(`DAY(${this.entityAlias}.created_at) = :day`, { day });
    }

    if (mode === 'YEAR' && year) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
    }

    if (mode === 'MONTH' && year && month) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`MONTH(${this.entityAlias}.created_at) = :month`, { month });
    }

    if (mode === 'DAY' && year && month && day) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`MONTH(${this.entityAlias}.created_at) = :month`, { month });
      query.andWhere(`DAY(${this.entityAlias}.created_at) = :day`, { day });
    }

    if (mode === 'WEEK' && year && week) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`WEEK(${this.entityAlias}.created_at, 1) = :week`, { week });
    }

    if (mode === 'QUARTER' && year && quarter) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`QUARTER(${this.entityAlias}.created_at) = :quarter`, { quarter });
    }

    if (limit) {
      query.limit(limit);
    }

    const data = await query.getRawMany();
    return data;
  }

  public async getLowSelling({ take, skip }: GetLowSelling) {
    const productDetailRepo = this.invoiceRepo.manager.getRepository(ProductDetailsEntity);

    const orderDetailRepo = this.invoiceRepo.manager.getRepository(OrderDetailEntity);

    const subQuery = orderDetailRepo
      .createQueryBuilder(`${this.orderDetailsAlias}sub`)
      .where(`${this.orderDetailsAlias}sub.product_detail_id = ${this.productDetailAlias}.id`)
      .select(`1`);

    const query = productDetailRepo
      .createQueryBuilder(this.productDetailAlias)
      .leftJoin(`${this.productDetailAlias}.product`, this.productAlias)
      .where(`NOT EXISTS (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .limit(take)
      .offset(skip)
      .select([
        `${this.productAlias}.id as productId`,
        `${this.productAlias}.product_name as productName`,
        `${this.productDetailAlias}.id as productDetailId`,
        '0 as quantity',
        `${this.productDetailAlias}.variationDetails as variationDetail`,
      ]);

    const data = await query.getRawMany();

    return data.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
    }));
  }

  public async getRevenue({ mode, year, month, day, week, quarter }: Stats) {
    const query = this.invoiceRepo
      .createQueryBuilder(this.entityAlias)
      .where(`${this.entityAlias}.status = :status`, { status: 'PAID' })
      .select([`SUM(${this.entityAlias}.total_amount) as revenue`]);

    if (mode === 'TODAY') {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`MONTH(${this.entityAlias}.created_at) = :month`, { month });
      query.andWhere(`DAY(${this.entityAlias}.created_at) = :day`, { day });
    }

    if (mode === 'YEAR' && year) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
    }

    if (mode === 'MONTH' && year && month) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`MONTH(${this.entityAlias}.created_at) = :month`, { month });
    }

    if (mode === 'DAY' && year && month && day) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`MONTH(${this.entityAlias}.created_at) = :month`, { month });
      query.andWhere(`DAY(${this.entityAlias}.created_at) = :day`, { day });
    }

    if (mode === 'WEEK' && year && week) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`WEEK(${this.entityAlias}.created_at, 1) = :week`, { week });
    }

    if (mode === 'QUARTER' && year && quarter) {
      query.andWhere(`YEAR(${this.entityAlias}.created_at) = :year`, { year });
      query.andWhere(`QUARTER(${this.entityAlias}.created_at) = :quarter`, { quarter });
    }

    const data = await query.getRawOne();

    return {
      revenue: +data.revenue,
    };
  }

  private generateDateList(start, end) {
    const dates = [];
    let currentDate = new Date(start);
    while (currentDate <= new Date(end)) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  private mergeRevenueData(dates, revenues, key = 'date') {
    return dates.map((date) => {
      const revenue = revenues.find((r) => r[key] === date);
      return {
        date,
        totalRevenue: revenue ? +revenue.totalRevenue : 0,
      };
    });
  }

  public async getRevenueV2({ mode, year, month }: GetRevenue) {
    if (mode === 'day') {
      const result = await this.invoiceRepo
        .createQueryBuilder('invoice')
        .select("DATE_FORMAT(invoice.created_at, '%Y-%m-%d')", 'date')
        .addSelect('IFNULL(SUM(invoice.total_amount), 0)', 'totalRevenue')
        .where('YEAR(invoice.created_at) = :year AND MONTH(invoice.created_at) = :month AND invoice.status = :status', {
          year,
          month,
          status: 'PAID',
        })
        .groupBy("DATE_FORMAT(invoice.created_at, '%Y-%m-%d')")
        .orderBy("DATE_FORMAT(invoice.created_at, '%Y-%m-%d')", 'ASC')
        .getRawMany();

      const dates = this.generateDateList(
        `${year}-${month.toString().padStart(2, '0')}-01`,
        `${year}-${month.toString().padStart(2, '0')}-31`
      );
      return this.mergeRevenueData(dates, result);
    }

    if (mode === 'month') {
      const result = await this.invoiceRepo
        .createQueryBuilder('invoice')
        .select('YEAR(invoice.created_at)', 'year')
        .addSelect('MONTH(invoice.created_at)', 'month')
        .addSelect('IFNULL(SUM(invoice.total_amount), 0)', 'totalRevenue')
        .where('YEAR(invoice.created_at) = :year', { year })
        .groupBy('YEAR(invoice.created_at), MONTH(invoice.created_at)')
        .orderBy('YEAR(invoice.created_at), MONTH(invoice.created_at)', 'ASC')
        .getRawMany();

      const months = Array.from({ length: 12 }, (_, i) => ({
        year,
        month: i + 1,
      }));

      return months.map(({ year, month }) => {
        const revenue = result.find((r) => r.year == year && r.month === month);
        return {
          year,
          month,
          totalRevenue: revenue ? +revenue.totalRevenue : 0,
        };
      });
    }

    if (mode === 'quarter') {
      const result = await this.invoiceRepo
        .createQueryBuilder('invoice')
        .select('YEAR(invoice.created_at)', 'year')
        .addSelect('QUARTER(invoice.created_at)', 'quarter')
        .addSelect('IFNULL(SUM(invoice.total_amount), 0)', 'totalRevenue')
        .where('YEAR(invoice.created_at) = :year', { year })
        .groupBy('YEAR(invoice.created_at), QUARTER(invoice.created_at)')
        .orderBy('YEAR(invoice.created_at), QUARTER(invoice.created_at)', 'ASC')
        .getRawMany();

      const quarters = Array.from({ length: 4 }, (_, i) => ({
        year,
        quarter: i + 1,
      }));

      return quarters.map(({ year, quarter }) => {
        const revenue = result.find((r) => r.year == year && r.quarter === quarter);
        return {
          year,
          quarter,
          totalRevenue: revenue ? +revenue.totalRevenue : 0,
        };
      });
    }

    return [];
  }
}
