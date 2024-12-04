export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductDimensions {
  length: string;
  width: string;
  height: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  price: number;
  regular_price: number;
  stock_quantity: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  brand: string;
  categories: Category[];
  images: ProductImage[];
  weight: string;
  dimensions: ProductDimensions;
  meta_data?: { key: string; value: any }[];
}

export interface CustomerType {
  id: number;
  name: string;
  discount_percentage: number;
}

export interface ProductWithCustomerPrice extends Product {
  customer_price: number;
  meta_data?: { key: string; value: any }[];
}
