export interface Variant {
  images: string[];
  name: string;
  options: string[];
}

export interface VariationDetails {
  [key: string | number]: string | number;
}
