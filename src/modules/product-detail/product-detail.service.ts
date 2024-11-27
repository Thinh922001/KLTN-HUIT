import { Injectable } from '@nestjs/common';
import { ProductDetailsRepository, ProductImgRepository, ProductRepository } from '../../repositories';
import { convertAnyTo, formatString, generateCombinationsVariant, generateSKUCode } from '../../utils/utils';
import { GetDetailProduct, IVariant } from './dto/get-detail-product.dto';
import {
  CateEntity,
  LabelEntity,
  LabelProductEntity,
  ProductDetailsEntity,
  ProductDetailsImgEntity,
  ProductsEntity,
} from '../../entities';
import { GetDetailProductRes } from './dto/get-detail-product-res.dtp';
import { AddImgDto } from './dto/add-img-prduct-detail.dto';
import { UploadApiResponse } from 'cloudinary';
import { In } from 'typeorm';
import { UpdateProductDetail } from './dto/update-product-detail.dto';

@Injectable()
export class ProductDetailService {
  productAlias: string;
  productDeAlias: string;
  productDetailImgAs: string;
  cateAlias: string;
  labelProductAlias: string;
  labelAlias: string;
  constructor(
    private readonly productDetailRepo: ProductDetailsRepository,
    private readonly productRepo: ProductRepository,
    private readonly productImg: ProductImgRepository
  ) {
    this.productAlias = ProductsEntity.name;
    this.cateAlias = CateEntity.name;
    this.labelProductAlias = LabelProductEntity.name;
    this.labelAlias = LabelEntity.name;
    this.productDeAlias = ProductDetailsEntity.name;
    this.productDetailImgAs = ProductDetailsImgEntity.name;
  }

  async generateSPU(product: ProductsEntity) {
    const { variants, product_code, price, oldPrice, discountPercent, id } = product;

    const createProductDetail = (skuCode: string, variationDetails = null) => ({
      sku_code: skuCode,
      price,
      oldPrice,
      discountPercent,
      variationDetails,
      stock: 50,
      product: {
        id: id,
      },
    });

    let productDetails = [];

    if (variants?.length) {
      const combinations = generateCombinationsVariant(variants);
      productDetails = combinations.map((combination) => {
        const skuCode = formatString(`${product_code}-${generateSKUCode(combination)}`);
        return createProductDetail(skuCode, combination);
      });
    } else {
      productDetails.push(createProductDetail(product_code));
    }

    const entity = this.productDetailRepo.create(productDetails);
    return await this.productDetailRepo.save(entity);
  }

  async updateSpecProduct() {
    //  const product = await this.productRepo.findOne({ where: { id: 1 } });
    // await this.productRepo.save({
    //   ...product,
    //   specifications: SpecData,
    // });
  }

  async getDetailProduct({ productId }: GetDetailProduct) {
    const productQuery = this.productRepo
      .createQueryBuilder(this.productAlias)
      .withDeleted()
      .leftJoinAndSelect(`${this.productAlias}.labelProducts`, this.labelProductAlias)
      .leftJoinAndSelect(`${this.labelProductAlias}.label`, this.labelAlias)
      .leftJoinAndSelect(`${this.productAlias}.cate`, this.cateAlias)
      .where(`${this.productAlias}.id = :id`, { id: productId })
      .cache(true)
      .select([
        `${this.productAlias}.id`,
        `${this.productAlias}.productName`,
        `${this.productAlias}.variants`,
        `${this.productAlias}.specifications`,
        `${this.productAlias}.img`,
        `${this.cateAlias}.id`,
        `${this.cateAlias}.name`,
        `${this.labelProductAlias}.id`,
        `${this.labelAlias}.text`,
        `${this.labelAlias}.type`,
      ]);

    const product = await productQuery.getOne();
    if (!product) {
      throw new Error('Product not found');
    }

    const { variants } = product;

    const productDetailQuery = this.productDetailRepo
      .createQueryBuilder(this.productDeAlias)
      .withDeleted()
      .leftJoinAndSelect(`${this.productDeAlias}.productDetailsImg`, this.productDetailImgAs)
      .where(`${this.productDeAlias}.product_id = :productId`, { productId })
      .cache(true)
      .select([
        `${this.productDeAlias}.id`,
        `${this.productDeAlias}.stock`,
        `${this.productDeAlias}.deletedAt`,
        `${this.productDeAlias}.variationDetails`,
        `${this.productDeAlias}.price`,
        `${this.productDeAlias}.oldPrice`,
        `${this.productDeAlias}.discountPercent`,
        `${this.productDetailImgAs}.id`,
        `${this.productDetailImgAs}.img`,
      ]);

    if (variants?.length) {
      const variantDefault = variants.map((e) => ({ [e.name]: e.options[0] }));

      const conditions = variantDefault.map((e) => {
        const [key, value] = Object.entries(e)[0];
        return `JSON_UNQUOTE(JSON_EXTRACT(${this.productDeAlias}.variationDetails, '$.${key}')) = :${key}`;
      });

      if (conditions.length) {
        productDetailQuery.andWhere(
          conditions.join(' AND '),
          variantDefault.reduce((params, e) => {
            const [key, value] = Object.entries(e)[0];
            params[key] = value;
            return params;
          }, {})
        );
      }
    }

    const productDetail = await productDetailQuery.getOne();
    return new GetDetailProductRes(productDetail, product);
  }

  async getProductDetailFromVariant({ variation, productId }: GetDetailProduct) {
    const query = this.productDetailRepo
      .createQueryBuilder(this.productDeAlias)
      .withDeleted()
      .leftJoinAndSelect(`${this.productDeAlias}.productDetailsImg`, this.productDetailImgAs)
      .where(`${this.productDeAlias}.product_id = :productId`, { productId })
      .cache(true)
      .select([
        `${this.productDeAlias}.id`,
        `${this.productDeAlias}.deletedAt`,
        `${this.productDeAlias}.stock`,
        `${this.productDeAlias}.variationDetails`,
        `${this.productDeAlias}.price`,
        `${this.productDeAlias}.oldPrice`,
        `${this.productDeAlias}.discountPercent`,
        `${this.productDetailImgAs}.id`,
        `${this.productDetailImgAs}.img`,
      ]);

    const variant = convertAnyTo<IVariant>(variation);

    const conditions = Object.entries(variant).map(
      ([key, value]) => `JSON_UNQUOTE(JSON_EXTRACT(${this.productDeAlias}.variationDetails, '$.${key}')) = :${key}`
    );

    if (conditions.length > 0) {
      query.andWhere(conditions.join(' AND '), variant);
    }

    const productDetailEntity = await query.getOne();

    return new GetDetailProductRes(productDetailEntity);
  }

  async addImgProductDetail(id: number, uploadResult: UploadApiResponse[]) {
    if (uploadResult.length > 0) {
      const productImg = uploadResult.map((e) =>
        this.productImg.create({
          publicId: e.public_id,
          img: e.url,
          productDetails: {
            id: id,
          },
        })
      );

      return await this.productImg.save(productImg);
    }
  }

  async getProductDetail(productDetailId: number) {
    const productDetail = await this.productDetailRepo
      .createQueryBuilder(this.productDeAlias)
      .withDeleted()
      .where(`${this.productDeAlias}.id =:productDetailId`, { productDetailId })
      .leftJoin(`${this.productDeAlias}.productDetailsImg`, this.productDetailImgAs)
      .select([
        `${this.productDeAlias}.id`,
        `${this.productDeAlias}.deletedAt`,
        `${this.productDeAlias}.price`,
        `${this.productDeAlias}.oldPrice`,
        `${this.productDeAlias}.discountPercent`,
        `${this.productDeAlias}.stock`,
        `${this.productDetailImgAs}.id`,
        `${this.productDetailImgAs}.img`,
      ])
      .getOne();

    return productDetail;
  }

  async getPublicIdFromProductImgDetail(imgId: number[]) {
    const data = await this.productImg
      .createQueryBuilder(this.productDetailImgAs)
      .select([`${this.productDetailImgAs}.publicId`])
      .where(`${this.productDetailImgAs}.id IN (:...imgId)`, { imgId })
      .getMany();

    if (!data || !data.length) return [];
    return data.map((e) => e.publicId);
  }

  async deleteImgId(imgId: number[]) {
    return await this.productImg.delete({ id: In(imgId) });
  }

  async updateProductDetail(productDetailId: number, updateProductDetail: UpdateProductDetail) {
    return await this.productDetailRepo.update(productDetailId, updateProductDetail);
  }

  async deleteProductDetail(productDetailId: number) {
    return await this.productDetailRepo.softDelete({ id: productDetailId });
  }

  async restoreProductDetail(productDetailId: number) {
    return await this.productDetailRepo.restore({ id: productDetailId });
  }
}
