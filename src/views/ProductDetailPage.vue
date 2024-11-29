<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/products"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ product?.name || 'Detalle del Producto' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="loading" class="ion-padding">
        <ion-skeleton-text :animated="true" style="width: 100%; height: 200px;"></ion-skeleton-text>
        <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
        <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
      </div>

      <div v-else-if="product" class="product-detail">
        <swiper
          v-if="productImages.length > 0"
          :modules="[SwiperNavigation, SwiperPagination]"
          :navigation="true"
          :pagination="{ clickable: true }"
          class="product-images"
        >
          <swiper-slide v-for="(image, index) in productImages" :key="index">
            <ion-img :src="image" :alt="product?.name" @ionError="handleImageError"></ion-img>
          </swiper-slide>
        </swiper>
        <div v-else class="default-image">
          <ion-img src="/placeholder-product.jpg" :alt="product?.name"></ion-img>
        </div>

        <div class="ion-padding">
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ product.name }}</ion-card-title>
              <ion-card-subtitle>{{ product.brand }}</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <div class="price-section">
                <div class="original-price" v-if="product.price !== product.customer_price">
                  <ion-text color="medium">
                    <s>${{ product.price.toLocaleString() }}</s>
                  </ion-text>
                </div>
                <div class="final-price">
                  <ion-text color="dark">
                    <strong>${{ product.customer_price.toLocaleString() }}</strong>
                  </ion-text>
                </div>
                <div class="discount" v-if="product.price !== product.customer_price">
                  <ion-chip color="success">
                    {{ Math.round((1 - product.customer_price / product.price) * 100) }}% OFF
                  </ion-chip>
                </div>
              </div>

              <div class="description">
                <p>{{ product.description }}</p>
              </div>

              <div class="stock-info">
                <ion-text :color="product.stock_status === 'instock' ? 'success' : 'danger'">
                  <ion-icon :icon="alertCircleOutline"></ion-icon>
                  {{ product.stock_status === 'instock' ? `En stock (${product.stock_quantity} unidades)` : 'Sin stock' }}
                </ion-text>
              </div>

              <div class="quantity-selector">
                <ion-item>
                  <ion-label>Cantidad:</ion-label>
                  <ion-select 
                    v-model="quantity" 
                    interface="popover" 
                    :disabled="product.stock_status !== 'instock'"
                  >
                    <ion-select-option 
                      v-for="qty in availableQuantities" 
                      :key="qty" 
                      :value="qty"
                    >
                      {{ qty }}
                    </ion-select-option>
                  </ion-select>
                </ion-item>
              </div>

              <ion-button 
                expand="block"
                @click="addToCart"
                :disabled="product.stock_status !== 'instock' || quantity < 1"
                class="add-to-cart-button"
              >
                <ion-icon :icon="cartOutline" slot="start"></ion-icon>
                Agregar al Carrito
              </ion-button>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-header>
              <ion-card-title>Detalles del Producto</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-label>
                    <h3>Marca</h3>
                    <p>{{ product.brand }}</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>SKU</h3>
                    <p>{{ product.sku }}</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Categorías</h3>
                    <p>{{ product.categories.map(cat => cat.name).join(', ') }}</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Peso</h3>
                    <p>{{ product.weight }}</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <h3>Dimensiones</h3>
                    <p>{{ product.dimensions.length }}x{{ product.dimensions.width }}x{{ product.dimensions.height }} cm</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </div>
      </div>

      <div v-else-if="error" class="ion-padding">
        <ion-text color="danger">
          <p>{{ error }}</p>
        </ion-text>
      </div>

      <div v-else class="ion-padding">
        <ion-text color="danger">
          <p>Producto no encontrado</p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonChip,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonList,
  IonImg,
  IonSkeletonText,
  toastController
} from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation as SwiperNavigation, Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { alertCircleOutline, cartOutline } from 'ionicons/icons';
import { productService } from '@/services/product.service';
import { cartService } from '@/services/cart.service';
import type { ProductWithCustomerPrice } from '@/types/product.types';

export default defineComponent({
  name: 'ProductDetailPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonText,
    IonChip,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonList,
    IonImg,
    IonSkeletonText,
    Swiper,
    SwiperSlide,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const product = ref<ProductWithCustomerPrice | null>(null);
    const loading = ref(true);
    const quantity = ref(1);
    const error = ref<string | null>(null);

    const productImages = computed(() => {
      if (!product.value?.images) return [];
      return Array.isArray(product.value.images) ? product.value.images : [];
    });

    const availableQuantities = computed(() => {
      if (!product.value?.stock_quantity || product.value.stock_status !== 'instock') return [];
      return Array.from({ length: Math.min(product.value.stock_quantity, 10) }, (_, i) => i + 1);
    });

    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;
      img.src = '/placeholder-product.jpg';
    };

    const loadProduct = async () => {
      try {
        loading.value = true;
        error.value = null;
        const productId = parseInt(route.params.id as string);
        product.value = await productService.getProduct(productId);
        if (!product.value) {
          error.value = 'Producto no encontrado';
          router.push('/products');
        }
      } catch (err) {
        error.value = 'Error al cargar el producto';
        console.error('Error loading product:', err);
      } finally {
        loading.value = false;
      }
    };

    const addToCart = async () => {
      if (!product.value || quantity.value < 1) return;
      
      try {
        await cartService.addToCart(product.value, quantity.value);
        const toast = await toastController.create({
          message: `${quantity.value} ${quantity.value === 1 ? 'unidad' : 'unidades'} agregadas al carrito`,
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
      } catch (err) {
        const toast = await toastController.create({
          message: 'Error al agregar al carrito',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
    };

    onMounted(() => {
      loadProduct();
    });

    return {
      product,
      loading,
      quantity,
      error,
      productImages,
      availableQuantities,
      handleImageError,
      addToCart,
      alertCircleOutline,
      cartOutline,
      SwiperNavigation,
      SwiperPagination,
    };
  },
});
</script>

<style scoped>
.product-detail {
  max-width: 800px;
  margin: 0 auto;
}

.product-images {
  width: 100%;
  height: 300px;
}

.product-images ion-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.price-section {
  margin: 16px 0;
}

.original-price {
  font-size: 0.9em;
}

.final-price {
  font-size: 1.5em;
  margin: 8px 0;
}

.discount ion-chip {
  margin: 0;
}

.description {
  margin: 16px 0;
  line-height: 1.5;
}

.stock-info {
  margin: 16px 0;
}

.stock-info ion-icon {
  vertical-align: middle;
  margin-right: 4px;
}

.quantity-selector {
  margin: 16px 0;
}

.add-to-cart-button {
  margin-top: 16px;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: var(--ion-color-primary);
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--ion-color-primary);
}
</style>
