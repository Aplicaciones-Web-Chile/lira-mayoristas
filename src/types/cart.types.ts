import type { ProductWithCustomerPrice } from './product.types';

export interface CartItem {
  product: ProductWithCustomerPrice;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
  discount: number;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  total: number;
  discount: number;
}
