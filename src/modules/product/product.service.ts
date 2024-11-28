import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BrandRepository,
  CateRepository,
  LabelProductRepository,
  ProductDetailsRepository,
  ProductRepository,
} from '../../repositories';
import {
  CateEntity,
  LabelEntity,
  LabelProductEntity,
  ProductDetailsEntity,
  ProductDetailsImgEntity,
  ProductsEntity,
} from '../../entities';
import { GetCateDto, IOrderBy, ISearch } from '../category/dto/cate.dto';
import { ProductDto } from './dto/product.dto';
import { applyPagination, convertAnyTo } from '../../utils/utils';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDetailService } from '../product-detail/product-detail.service';
import { LabelsService } from '../labels/labels.service';
import { Transactional } from 'typeorm-transactional';
import { UpdateProduct } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductService {
  entityAlias: string;
  cateAlias: string;
  labelProductAlias: string;
  labelAlias: string;
  productAlias: string;
  productDetailAlias: string;
  productDetailImg: string;
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly brandRepo: BrandRepository,
    private readonly cateRepo: CateRepository,
    private readonly labelProductRepo: LabelProductRepository,
    private readonly productDetailRepo: ProductDetailsRepository,
    private readonly productDetailService: ProductDetailService,
    private readonly labelService: LabelsService
  ) {
    this.entityAlias = ProductsEntity.name;
    this.cateAlias = CateEntity.name;
    this.labelProductAlias = LabelProductEntity.name;
    this.labelAlias = LabelEntity.name;
    this.productAlias = ProductsEntity.name;
    this.productDetailAlias = ProductDetailsEntity.name;
    this.productDetailImg = ProductDetailsImgEntity.name;
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

  @Transactional()
  public async updateProductAdmin(productId: number, updateProductDto: UpdateProduct) {
    let { brandId, cateId, labelsId, variants, ...updateEntity } = updateProductDto;

    if (variants) {
      throw new BadRequestException('Variant is not handle');
    }

    if (brandId) {
      const newBrand = await this.brandRepo.findOne({ where: { id: brandId } });
      if (!newBrand) {
        throw new BadRequestException('Brand not found');
      }

      await this.productRepo.update(productId, {
        brand: newBrand,
      });
    }

    if (cateId) {
      const newCate = await this.cateRepo.findOne({ where: { id: cateId } });

      if (!newCate) {
        throw new BadRequestException('Category not found');
      }

      await this.productRepo.update(productId, {
        cate: newCate,
      });
    }

    if (labelsId && labelsId.length > 0) {
    }

    return await this.updateProduct(productId, updateEntity);
  }

  public async getProduct({ cateId, brandId, take, skip }: GetProductDto) {
    const query = this.productRepo
      .createQueryBuilder(this.productAlias)
      .withDeleted()
      .select([
        `${this.productAlias}.id`,
        `${this.productAlias}.deletedAt`,
        `${this.productAlias}.productName`,
        `${this.productAlias}.product_code`,
        `${this.productAlias}.img`,
        `${this.productAlias}.tabs`,
        `${this.productAlias}.totalVote`,
        `${this.productAlias}.starRate`,
        `${this.productAlias}.price`,
        `${this.productAlias}.discountPercent`,
        `${this.productAlias}.oldPrice`,
      ]);

    if (cateId) {
      query.andWhere(`${this.productAlias}.cate_id =:cateId`, { cateId });
    }

    if (brandId) {
      query.andWhere(`${this.productAlias}.brand_id =:brandId`, { brandId });
    }

    const { data, paging } = await applyPagination<ProductsEntity>(query, take, skip);

    return {
      data: data,
      paging: paging,
    };
  }

  async getProductByIdAdm(productId: number) {
    const product = await this.productRepo
      .createQueryBuilder(this.productAlias)
      .withDeleted()
      .where(`${this.productAlias}.id =:productId`, { productId })
      .leftJoin(`${this.productAlias}.productDetails`, this.productDetailAlias)
      .leftJoin(`${this.productDetailAlias}.productDetailsImg`, this.productDetailImg)
      .select([
        `${this.productAlias}.id`,
        `${this.productAlias}.deletedAt`,
        `${this.productAlias}.productName`,
        `${this.productAlias}.product_code`,
        `${this.productAlias}.img`,
        `${this.productAlias}.tabs`,
        `${this.productAlias}.totalVote`,
        `${this.productAlias}.starRate`,
        `${this.productAlias}.price`,
        `${this.productAlias}.discountPercent`,
        `${this.productAlias}.oldPrice`,
        `${this.productDetailAlias}.id`,
        `${this.productDetailAlias}.deletedAt`,
        `${this.productDetailAlias}.price`,
        `${this.productDetailAlias}.oldPrice`,
        `${this.productDetailAlias}.discountPercent`,
        `${this.productDetailAlias}.stock`,
        `${this.productDetailImg}.id`,
        `${this.productDetailImg}.img`,
      ])
      .getOne();

    return product;
  }

  @Transactional()
  async deleteProduct(productId: number) {
    await this.productRepo.softDelete({ id: productId });
    await this.productDetailRepo.softDelete({ product: { id: productId } });
  }

  @Transactional()
  async undoDeleteProduct(productId: number) {
    await this.productRepo.restore({ id: productId });
    await this.productDetailRepo.restore({ product: { id: productId } });
  }

  async getRandomProduct() {
    try {
      const query = this.productRepo
        .createQueryBuilder(this.productAlias)
        .withDeleted()
        .leftJoin(`${this.entityAlias}.labelProducts`, this.labelProductAlias)
        .leftJoin(`${this.labelProductAlias}.label`, this.labelAlias)
        .take(30)
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
        ])
        .orderBy('RAND()')
        .cache('random_products_cache', 86400000);

      const data = await query.getMany();

      console.log(data.length);
      return (data && data.map((e) => new ProductDto(e))).sort((a, b) => a.id - b.id) || [];
    } catch (error) {
      console.error('Lỗi khi thực thi query getRandomProduct:', error);
      return [];
    }
  }
}
