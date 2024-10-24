import { ISpecifications, Variant } from '../../../vendors/base/type';
import { IDisCount, ILabel } from '../../../modules/product/dto/product.dto';
import { ProductDetailsEntity, ProductsEntity } from '../../../entities';
import { convertHttpToHttps } from '../../../utils/utils';

export class GetDetailProductRes {
  id: number;
  title?: string;
  img?: string;
  subImg?: string[];
  labels?: ILabel[];
  discount?: IDisCount;
  price: number;
  stock: number;
  variation?: Variant[];
  specifications?: ISpecifications[];

  constructor(productDetail: ProductDetailsEntity, product?: ProductsEntity) {
    const { id, price, oldPrice, discountPercent, productDetailsImg, stock } = productDetail;
    this.id = id;
    this.price = price;
    this.stock = stock;
    this.discount = oldPrice && discountPercent ? { OldPrice: oldPrice, discountPercent } : undefined;
    this.subImg = productDetailsImg?.map((e) => convertHttpToHttps(e.img)) || [];

    if (product) {
      const { specifications, variants, cate, productName, labelProducts, img } = product;
      this.specifications = specifications;
      this.variation = variants;
      this.title = `${cate.name} ${productName}`;
      this.labels =
        labelProducts?.map<ILabel>((e) => ({
          label: e.label.type,
          text: e.label.text,
        })) || undefined;
      this.img = img;
    }
  }
}
