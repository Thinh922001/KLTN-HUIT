import { Injectable } from '@nestjs/common';
import { ProductDetailsRepository, ProductRepository } from '../../repositories';
import { formatString, generateCombinationsVariant, generateSKUCode } from '../../utils/utils';
import { GetDetailProduct } from './dto/get-detail-product.dto';

@Injectable()
export class ProductDetailService {
  constructor(
    private readonly productDetailRepo: ProductDetailsRepository,
    private readonly productRepo: ProductRepository
  ) {}

  async generateSPU() {
    const product = await this.productRepo.findOne({ where: { id: 1 } });

    const { variants, product_code, price, oldPrice, discountPercent, id } = product;

    const combinations = generateCombinationsVariant(variants);

    const productDetail = combinations.map((e) => {
      const skuCode = formatString(`${product_code}-${generateSKUCode(e)}`);
      return {
        sku_code: skuCode,
        price,
        oldPrice,
        discountPercent,
        variationDetails: e,
        stock: 50,
        product: {
          id: id,
        },
      };
    });

    const entity = this.productDetailRepo.create(productDetail);

    await this.productDetailRepo.save(entity);
  }

  async getDetailProduct({ productId }: GetDetailProduct) {
    // const product = this.productRepo.createQueryBuilder()
  }
}
