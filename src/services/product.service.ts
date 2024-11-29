import { Product, CustomerType, ProductWithCustomerPrice } from '@/types/product.types';
import { authService } from './auth.service';

// Datos de prueba para tipos de cliente
const CUSTOMER_TYPES: CustomerType[] = [
  {
    id: 1,
    name: 'Cliente Regular',
    discount_percentage: 5
  },
  {
    id: 2,
    name: 'Cliente Premium',
    discount_percentage: 10
  },
  {
    id: 3,
    name: 'Cliente VIP',
    discount_percentage: 15
  }
];

// Datos de prueba para productos
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Champion Dog Adulto',
    slug: 'champion-dog-adulto',
    description: 'Alimento completo para perros adultos con proteínas de alta calidad',
    short_description: 'Nutrición premium para perros adultos',
    sku: 'CHMP-DOG-AD-15',
    price: 45990,
    regular_price: 45990,
    stock_quantity: 100,
    stock_status: 'instock',
    brand: 'Champion',
    categories: [
      { id: 1, name: 'Perros', slug: 'perros' },
      { id: 2, name: 'Alimentos Secos', slug: 'alimentos-secos' }
    ],
    images: [
      {
        id: 1,
        src: 'https://via.placeholder.com/500x500.png?text=Champion+Dog',
        alt: 'Champion Dog Adulto'
      }
    ],
    weight: '15kg',
    dimensions: {
      length: '60',
      width: '40',
      height: '10'
    }
  },
  {
    id: 2,
    name: 'Master Dog Cachorro',
    slug: 'master-dog-cachorro',
    description: 'Alimento especial para cachorros en crecimiento',
    short_description: 'Nutrición balanceada para cachorros',
    sku: 'MSTR-DOG-PUP-18',
    price: 42990,
    regular_price: 42990,
    stock_quantity: 75,
    stock_status: 'instock',
    brand: 'Master Dog',
    categories: [
      { id: 1, name: 'Perros', slug: 'perros' },
      { id: 3, name: 'Cachorros', slug: 'cachorros' }
    ],
    images: [
      {
        id: 2,
        src: 'https://via.placeholder.com/500x500.png?text=Master+Dog',
        alt: 'Master Dog Cachorro'
      }
    ],
    weight: '18kg',
    dimensions: {
      length: '65',
      width: '45',
      height: '12'
    }
  },
  {
    id: 3,
    name: 'Royal Canin Gatos Adultos',
    slug: 'royal-canin-gatos-adultos',
    description: 'Alimento premium para gatos adultos',
    short_description: 'Nutrición especializada para gatos',
    sku: 'RCAN-CAT-AD-10',
    price: 52990,
    regular_price: 52990,
    stock_quantity: 50,
    stock_status: 'instock',
    brand: 'Royal Canin',
    categories: [
      { id: 4, name: 'Gatos', slug: 'gatos' },
      { id: 2, name: 'Alimentos Secos', slug: 'alimentos-secos' }
    ],
    images: [
      {
        id: 3,
        src: 'https://via.placeholder.com/500x500.png?text=Royal+Canin',
        alt: 'Royal Canin Gatos'
      }
    ],
    weight: '10kg',
    dimensions: {
      length: '50',
      width: '35',
      height: '8'
    }
  }
];

// Simula un delay de red
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  weight?: string;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  perPage?: number;
}

class ProductService {
  async getProducts(filters: ProductFilters = {}): Promise<{ 
    products: ProductWithCustomerPrice[],
    total: number,
    page: number,
    totalPages: number
  }> {
    await simulateNetworkDelay();
    
    let filteredProducts = [...MOCK_PRODUCTS];
    
    // Aplicar filtros
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(p => 
        p.categories.some(c => c.slug === filters.category)
      );
    }

    if (filters.brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }

    if (filters.weight) {
      filteredProducts = filteredProducts.filter(p => p.weight === filters.weight);
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.stock_status === 'instock');
    }

    // Ordenamiento
    if (filters.sortBy) {
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    // Paginación
    const page = filters.page || 1;
    const perPage = filters.perPage || 10;
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    
    filteredProducts = filteredProducts.slice(start, end);

    // Aplicar precios según tipo de cliente
    const customerType = await this.getCustomerType();
    const productsWithPrices = filteredProducts.map(product => ({
      ...product,
      customer_price: customerType
        ? product.price * (1 - customerType.discount_percentage / 100)
        : product.price
    }));

    return {
      products: productsWithPrices,
      total,
      page,
      totalPages
    };
  }

  async getProduct(id: number): Promise<ProductWithCustomerPrice | null> {
    await simulateNetworkDelay();
    const product = MOCK_PRODUCTS.find(p => p.id === id) || null;
    
    if (!product) return null;
    
    const customerType = await this.getCustomerType();
    return {
      ...product,
      customer_price: customerType
        ? product.price * (1 - customerType.discount_percentage / 100)
        : product.price
    };
  }

  async getCustomerType(): Promise<CustomerType | null> {
    const user = authService.getCurrentUser();
    return user ? CUSTOMER_TYPES[0] : null;
  }

  async getBrands(): Promise<string[]> {
    await simulateNetworkDelay();
    return [...new Set(MOCK_PRODUCTS.map(p => p.brand))];
  }

  async getWeights(): Promise<string[]> {
    await simulateNetworkDelay();
    return [...new Set(MOCK_PRODUCTS.map(p => p.weight))];
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    await simulateNetworkDelay();
    const prices = MOCK_PRODUCTS.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }
}

export const productService = new ProductService();
