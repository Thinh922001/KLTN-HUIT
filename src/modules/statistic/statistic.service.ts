import { Injectable } from '@nestjs/common';
import { getGroupByStats } from '../../utils/utils';
import { InvoiceEntity, OrderDetailEntity, OrderEntity, ProductDetailsEntity, ProductsEntity } from '../../entities';
import { InvoiceRepository } from '../../repositories';
import { GetLowSelling, Stats } from './dto/invoice-statistic.dto';

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
}
