import { ProductsEntity } from '../../../entities';

export enum ELabel {
  NORMAL,
  PRIMARY,
}

export interface ILabel {
  label: ELabel;
  text: string;
}

export interface IDisCount {
  OldPrice: number;
  discountPercent: number;
}

export interface IVote {
  totalVote: number;
  startRate: number;
}

export class ProductDto {
  id: number;
  title: string;
  img: string;
  labels: ILabel[];
  txtOnline: number;
  price: number;
  tabs: string[];
  discount?: IDisCount;
  vote?: IVote;
  constructor(entity: ProductsEntity) {
    const {
      id,
      img,
      productName,
      labelProducts,
      textOnlineType,
      price,
      discountPercent,
      oldPrice,
      starRate,
      totalVote,
      tabs,
    } = entity;

    this.id = id;
    this.img = img;
    this.title = productName;
    this.txtOnline = textOnlineType;
    this.price = price;
    this.tabs = tabs;

    this.labels =
      labelProducts.length > 0
        ? labelProducts.map<ILabel>((e) => ({
            label: e.label.type,
            text: e.label.text,
          }))
        : [];

    this.discount = discountPercent && oldPrice ? { OldPrice: oldPrice, discountPercent } : undefined;

    this.vote = starRate && totalVote ? { startRate: starRate, totalVote } : undefined;
  }
}
