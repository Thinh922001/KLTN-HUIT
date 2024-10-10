export interface Variant {
  images: string[];
  name: string;
  options: string[];
}

export interface VariationDetails {
  [key: string | number]: string | number;
}

export interface ISpecifications {
  name: string;
  values: IChildSpec[];
}

export interface IChildSpec {
  name: string;
  desc: string[];
}
