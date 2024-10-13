import { Injectable } from '@nestjs/common';
import { BrandRepository, CateRepository, LabelProductRepository, ProductRepository } from '../../repositories';
import { CateEntity, LabelEntity, LabelProductEntity, ProductsEntity } from '../../entities';
import { GetCateDto, IOrderBy, ISearch } from '../category/dto/cate.dto';
import { ProductDto } from './dto/product.dto';
import { applyPagination, convertAnyTo } from '../../utils/utils';
import { SelectQueryBuilder } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { LabelsService } from '../labels/labels.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ProductService {
  entityAlias: string;
  cateAlias: string;
  labelProductAlias: string;
  labelAlias: string;
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly brandRepo: BrandRepository,
    private readonly cateRepo: CateRepository,
    private readonly labelProductRepo: LabelProductRepository,
    private readonly productDetailService: ProductDetailService,
    private readonly labelService: LabelsService
  ) {
    this.entityAlias = ProductsEntity.name;
    this.cateAlias = CateEntity.name;
    this.labelProductAlias = LabelProductEntity.name;
    this.labelAlias = LabelEntity.name;
  }
  public async getProductByCate({ cateId, take, skip, orderBy, filters }: GetCateDto) {
    const query = this.productRepo
      .createQueryBuilder(this.entityAlias)
      .innerJoinAndSelect(
        `${this.entityAlias}.labelProducts`,
        this.labelProductAlias,
        `${this.labelProductAlias}.product_id = ${this.entityAlias}.id`
      )
      .innerJoinAndSelect(`${this.labelProductAlias}.label`, this.labelAlias)
      .where(`${this.entityAlias}.cate_id = :cateId`, { cateId })
      .cache(true)
      .select([
        `${this.entityAlias}.id`,
        `${this.entityAlias}.createdAt`,
        `${this.entityAlias}.productName`,
        `${this.entityAlias}.img`,
        `${this.entityAlias}.textOnlineType`,
        `${this.entityAlias}.tabs`,
        `${this.entityAlias}.totalVote`,
        `${this.entityAlias}.starRate`,
        `${this.entityAlias}.price`,
        `${this.entityAlias}.oldPrice`,
        `${this.entityAlias}.discountPercent`,
        `${this.labelProductAlias}.id`,
        `${this.labelAlias}.text`,
        `${this.labelAlias}.type`,
      ]);

    if (orderBy) {
      this.applyOrderBy(query, orderBy);
    }

    if (filters) {
      this.applyFilters(query, filters);
    }

    const { data, paging } = await applyPagination<ProductsEntity>(query, take, skip);

    const result: ProductDto[] = data.map((e) => new ProductDto(e));

    return {
      data: result,
      paging: paging,
    };
  }

  private applyOrderBy(query: SelectQueryBuilder<any>, orderBy: IOrderBy) {
    if (orderBy) {
      const obj: IOrderBy = convertAnyTo<IOrderBy>(orderBy);
      const orderFields = [
        { key: 'trend', column: `${this.entityAlias}.starRate` },
        { key: 'well-sell', column: `${this.entityAlias}.totalVote` },
        { key: 'discount', column: `${this.entityAlias}.discountPercent` },
        { key: 'new', column: `${this.entityAlias}.createdAt` },
        { key: 'price', column: `${this.entityAlias}.price` },
      ];

      orderFields.forEach(({ key, column }, index) => {
        if (obj[key]) {
          if (index === 0) {
            query.orderBy(column, obj[key]);
          } else {
            query.addOrderBy(column, obj[key]);
          }
        }
      });
    }
  }

  private applyFilters(query: SelectQueryBuilder<any>, filters: ISearch) {
    if (filters) {
      const obj: ISearch = convertAnyTo<ISearch>(filters);
      const brandFilter = obj['brand'];
      if (Array.isArray(brandFilter) && brandFilter.length > 0) {
        query.andWhere(`${this.entityAlias}.brand_id IN (:...ids)`, { ids: brandFilter });
      }
    }
  }

  @Transactional()
  public async createProduct(createProductDto: CreateProductDto) {
    const {
      productName,
      productCode,
      textOnlineType,
      tabs,
      variants,
      totalVote,
      starRate,
      price,
      discountPercent,
      oldPrice,
      cateId,
      brandId,
      labelsId,
    } = createProductDto;

    const [brand, cate] = await Promise.all([
      this.brandRepo.findOne({ where: { id: brandId } }),
      this.cateRepo.findOne({ where: { id: cateId } }),
    ]);

    if (!brand) {
      throw new Error('Brand not found');
    }
    if (!cate) {
      throw new Error('Category not found');
    }

    const productEntity = this.productRepo.create({
      productName,
      product_code: productCode,
      textOnlineType: textOnlineType || null,
      tabs: tabs || [],
      variants: variants || [],
      totalVote: totalVote,
      starRate: starRate,
      price: price,
      oldPrice: oldPrice,
      discountPercent: discountPercent,
      brand: brand,
      cate: cate,
    });

    const checkLabels = await this.labelService.checkLabels(labelsId);

    if (!checkLabels) throw new Error('Labels not found');

    const saveProductEntity = await this.productRepo.save(productEntity);

    const [saveProductDetailEntity, saveLabelsProduct] = await Promise.all([
      this.productDetailService.generateSPU(saveProductEntity),
      this.createLabelProduct(saveProductEntity.id, labelsId),
    ]);

    return {
      product: saveProductEntity,
      productDetail: saveProductDetailEntity,
    };
  }

  public async getProductById(productId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      select: ['id'],
    });

    if (!product) throw new Error('Product not found');
    return product;
  }

  public async updateProduct(id: number, updateData: Partial<ProductsEntity>): Promise<ProductsEntity> {
    await this.productRepo.update(id, updateData);
    return await this.productRepo.findOne({ where: { id } });
  }

  public async createLabelProduct(productId: number, labelsId: number[]) {
    const labelProducts = labelsId.map((e) =>
      this.labelProductRepo.create({
        product: { id: productId },
        label: {
          id: e,
        },
      })
    );
    return await this.labelProductRepo.save(labelProducts);
  }
}
