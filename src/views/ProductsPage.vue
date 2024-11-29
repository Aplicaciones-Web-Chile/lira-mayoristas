<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Productos</ion-title>
        
        <!-- Filtros -->
        <ion-buttons slot="end">
          <ion-button @click="toggleFilters">
            <ion-icon :icon="filterOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Barra de filtros -->
      <div class="filters-container" v-if="showFilters">
        <!-- Búsqueda -->
        <ion-searchbar
          v-model="filters.search"
          placeholder="Buscar productos"
          :debounce="500"
          @ionInput="loadProducts"
          class="search-bar"
        ></ion-searchbar>
        
        <!-- Filtros principales -->
        <div class="main-filters">
          <ion-segment v-model="filters.category" @ionChange="loadProducts" class="category-segment">
            <ion-segment-button value="all">
              <ion-label>Todos</ion-label>
            </ion-segment-button>
            <ion-segment-button value="perros">
              <ion-label>Perros</ion-label>
            </ion-segment-button>
            <ion-segment-button value="gatos">
              <ion-label>Gatos</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <!-- Filtros secundarios -->
        <div class="secondary-filters">
          <ion-card>
            <ion-card-content>
              <div class="filter-row">
                <div class="filter-group">
                  <ion-item lines="none">
                    <ion-label position="stacked">Ordenar por</ion-label>
                    <ion-select 
                      v-model="filters.sortBy" 
                      @ionChange="loadProducts"
                      interface="popover"
                      placeholder="Seleccionar orden"
                    >
                      <ion-select-option value="name_asc">Nombre A-Z</ion-select-option>
                      <ion-select-option value="name_desc">Nombre Z-A</ion-select-option>
                      <ion-select-option value="price_asc">Menor precio</ion-select-option>
                      <ion-select-option value="price_desc">Mayor precio</ion-select-option>
                    </ion-select>
                  </ion-item>
                </div>

                <div class="filter-group">
                  <ion-item lines="none" v-if="brands.length">
                    <ion-label position="stacked">Marca</ion-label>
                    <ion-select 
                      v-model="filters.brand" 
                      @ionChange="loadProducts"
                      interface="popover"
                      placeholder="Todas las marcas"
                    >
                      <ion-select-option value="">Todas</ion-select-option>
                      <ion-select-option v-for="brand in brands" :key="brand" :value="brand">
                        {{ brand }}
                      </ion-select-option>
                    </ion-select>
                  </ion-item>
                </div>
              </div>

              <div class="filter-row">
                <div class="filter-group price-range">
                  <ion-label>Rango de precio</ion-label>
                  <div class="price-labels">
                    <span>${{ filters.minPrice || priceRange.min }}</span>
                    <span>${{ filters.maxPrice || priceRange.max }}</span>
                  </div>
                  <ion-range
                    :min="priceRange.min"
                    :max="priceRange.max"
                    :value="{ lower: filters.minPrice || priceRange.min, upper: filters.maxPrice || priceRange.max }"
                    @ionChange="handlePriceChange"
                    dual-knobs
                  ></ion-range>
                </div>
              </div>

              <div class="filter-row">
                <ion-item lines="none" class="stock-toggle">
                  <ion-label>Solo productos en stock</ion-label>
                  <ion-toggle v-model="filters.inStock" @ionChange="loadProducts"></ion-toggle>
                </ion-item>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Cliente Info Banner -->
      <ion-card v-if="customerType" class="customer-info">
        <ion-card-content>
          <ion-text color="medium">{{ customerType.name }}</ion-text>
          <ion-chip color="success">
            {{ customerType.discount_percentage }}% Descuento
          </ion-chip>
        </ion-card-content>
      </ion-card>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <ion-text>Cargando productos...</ion-text>
      </div>

      <!-- Products Grid -->
      <ion-grid v-else>
        <ion-row>
          <ion-col
            size="12"
            size-sm="6"
            size-md="4"
            size-lg="3"
            v-for="product in products"
            :key="product.id"
          >
            <ion-card @click="goToProduct(product.id)">
              <img :src="product.images[0]?.src" :alt="product.images[0]?.alt" />
              <ion-card-header>
                <ion-card-subtitle>{{ product.categories[0]?.name }}</ion-card-subtitle>
                <ion-card-title>{{ product.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <p>{{ product.short_description }}</p>
                <div class="price-container">
                  <div class="price" :class="{ 'has-discount': product.customer_price < product.price }">
                    <ion-text color="medium" class="regular-price" v-if="product.customer_price < product.price">
                      ${{ product.price.toLocaleString() }}
                    </ion-text>
                    <ion-text color="dark" class="final-price">
                      ${{ product.customer_price.toLocaleString() }}
                    </ion-text>
                  </div>
                  <ion-chip :color="product.stock_status === 'instock' ? 'success' : 'warning'">
                    {{ product.stock_status === 'instock' ? 'En stock' : 'Agotado' }}
                  </ion-chip>
                </div>
                <ion-button expand="block" @click="addToCart(product)">
                  Agregar al carrito
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Paginación -->
      <ion-infinite-scroll
        @ionInfinite="loadMore"
        :disabled="currentPage >= totalPages"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Cargando más productos..."
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRange,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/vue';
import { filterOutline } from 'ionicons/icons';
import { productService } from '@/services/product.service';
import type { ProductWithCustomerPrice, CustomerType } from '@/types/product.types';
import type { ProductFilters } from '@/services/product.service';

export default defineComponent({
  name: 'ProductsPage',
  components: {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonPage,
    IonRange,
    IonRow,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTitle,
    IonToggle,
    IonToolbar,
  },
  setup() {
    const router = useRouter();
    const products = ref<ProductWithCustomerPrice[]>([]);
    const customerType = ref<CustomerType | null>(null);
    const loading = ref(true);
    const showFilters = ref(false);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const brands = ref<string[]>([]);
    const priceRange = ref({ min: 0, max: 100000 });

    const filters = ref<ProductFilters>({
      search: '',
      category: 'all',
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false,
      sortBy: undefined,
      page: 1,
      perPage: 12
    });

    const loadProducts = async (resetPage = true) => {
      try {
        loading.value = true;
        if (resetPage) {
          currentPage.value = 1;
          filters.value.page = 1;
        }

        const response = await productService.getProducts(filters.value);
        
        if (resetPage) {
          products.value = response.products;
        } else {
          products.value = [...products.value, ...response.products];
        }
        
        totalPages.value = response.totalPages;
        currentPage.value = response.page;
        
        if (!customerType.value) {
          customerType.value = await productService.getCustomerType();
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        loading.value = false;
      }
    };

    const loadMore = async (ev: CustomEvent) => {
      if (currentPage.value < totalPages.value) {
        filters.value.page = currentPage.value + 1;
        await loadProducts(false);
      }
      (ev.target as HTMLIonInfiniteScrollElement).complete();
    };

    const loadFilters = async () => {
      try {
        const [brandsData, priceRangeData] = await Promise.all([
          productService.getBrands(),
          productService.getPriceRange()
        ]);
        
        brands.value = brandsData;
        priceRange.value = priceRangeData;
        
        // Inicializar los filtros de precio con el rango completo
        filters.value.minPrice = priceRangeData.min;
        filters.value.maxPrice = priceRangeData.max;
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    const handlePriceChange = (ev: CustomEvent) => {
      const { lower, upper } = ev.detail.value;
      filters.value.minPrice = lower;
      filters.value.maxPrice = upper;
      loadProducts();
    };

    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    const addToCart = (product: ProductWithCustomerPrice) => {
      // TODO: Implementar la funcionalidad del carrito
      console.log('Agregando al carrito:', product);
    };

    const goToProduct = (id: number) => {
      router.push(`/products/${id}`);
    };

    onMounted(() => {
      loadProducts();
      loadFilters();
    });

    return {
      products,
      customerType,
      loading,
      showFilters,
      currentPage,
      totalPages,
      brands,
      priceRange,
      filters,
      filterOutline,
      loadProducts,
      loadMore,
      handlePriceChange,
      toggleFilters,
      addToCart,
      goToProduct
    };
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
}

.customer-info {
  margin: 1rem;
}

.price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.price {
  display: flex;
  flex-direction: column;
}

.regular-price {
  text-decoration: line-through;
  font-size: 0.9em;
}

.final-price {
  font-size: 1.2em;
  font-weight: bold;
}

ion-card {
  margin: 0.5rem;
}

ion-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

ion-infinite-scroll {
  margin-top: 1rem;
}

.filters-container {
  padding: 1rem;
  background: var(--ion-background-color);
}

.search-bar {
  margin-bottom: 1rem;
  --border-radius: 8px;
  --background: var(--ion-color-light);
}

.main-filters {
  margin-bottom: 1rem;
}

.category-segment {
  background: var(--ion-color-light);
  border-radius: 8px;
  --background: var(--ion-color-light);
}

.secondary-filters ion-card {
  margin: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-group {
  flex: 1;
}

.filter-group ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
}

.price-range {
  width: 100%;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  color: var(--ion-color-medium);
  font-size: 0.9em;
}

.stock-toggle {
  width: 100%;
}

ion-select {
  width: 100%;
  max-width: 100%;
  --padding-start: 0;
}
</style>
