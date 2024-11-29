<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/products"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle del Producto</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <ion-text>Cargando producto...</ion-text>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <ion-icon :icon="alertCircleOutline" size="large" color="danger"></ion-icon>
        <h2>Error al cargar el producto</h2>
        <p>{{ error }}</p>
        <ion-button @click="loadProduct">Reintentar</ion-button>
      </div>

      <!-- Product Detail -->
      <div v-else-if="product" class="product-detail">
        <!-- Image Gallery -->
        <ion-slides pager="true" class="product-slides">
          <ion-slide v-for="image in product.images" :key="image.id">
            <img :src="image.src" :alt="image.alt" />
          </ion-slide>
        </ion-slides>

        <!-- Product Info -->
        <div class="product-info">
          <ion-card>
            <ion-card-header>
              <div class="product-header">
                <div>
                  <ion-card-subtitle>
                    <ion-chip v-for="category in product.categories" :key="category.id">
                      {{ category.name }}
                    </ion-chip>
                  </ion-card-subtitle>
                  <ion-card-title>{{ product.name }}</ion-card-title>
                </div>
                <ion-chip :color="product.stock_status === 'instock' ? 'success' : 'warning'">
                  {{ product.stock_status === 'instock' ? 'En stock' : 'Agotado' }}
                </ion-chip>
              </div>
            </ion-card-header>

            <ion-card-content>
              <!-- Pricing -->
              <div class="pricing-section">
                <div class="price-container">
                  <div class="price" :class="{ 'has-discount': product.customer_price < product.price }">
                    <ion-text color="medium" class="regular-price" v-if="product.customer_price < product.price">
                      ${{ product.price.toLocaleString() }}
                    </ion-text>
                    <ion-text color="dark" class="final-price">
                      ${{ product.customer_price.toLocaleString() }}
                    </ion-text>
                  </div>
                  <ion-chip color="success" v-if="product.customer_price < product.price">
                    {{ ((1 - product.customer_price / product.price) * 100).toFixed(0) }}% Descuento
                  </ion-chip>
                </div>
              </div>

              <!-- Product Details -->
              <div class="details-section">
                <h3>Detalles del Producto</h3>
                <p>{{ product.description }}</p>
                
                <ion-list>
                  <ion-item>
                    <ion-label>
                      <h3>SKU</h3>
                      <p>{{ product.sku }}</p>
                    </ion-label>
                  </ion-item>
                  
                  <ion-item>
                    <ion-label>
                      <h3>Marca</h3>
                      <p>{{ product.brand }}</p>
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
                      <p>{{ product.dimensions.length }} × {{ product.dimensions.width }} × {{ product.dimensions.height }}</p>
                    </ion-label>
                  </ion-item>

                  <ion-item>
                    <ion-label>
                      <h3>Stock</h3>
                      <p>{{ product.stock_quantity }} unidades</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </div>

              <!-- Add to Cart Section -->
              <div class="cart-section">
                <ion-item>
                  <ion-label>Cantidad</ion-label>
                  <ion-input
                    type="number"
                    v-model="quantity"
                    min="1"
                    :max="product.stock_quantity"
                    class="quantity-input"
                  ></ion-input>
                </ion-item>
                
                <ion-button 
                  expand="block"
                  :disabled="!product.stock_quantity || product.stock_status === 'outofstock'"
                  @click="addToCart"
                >
                  <ion-icon :icon="cartOutline" slot="start"></ion-icon>
                  Agregar al Carrito
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSlide,
  IonSlides,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { alertCircleOutline, cartOutline } from 'ionicons/icons';
import { productService } from '@/services/product.service';
import type { ProductWithCustomerPrice } from '@/types/product.types';

export default defineComponent({
  name: 'ProductDetailPage',
  components: {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSlide,
    IonSlides,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const route = useRoute();
    const product = ref<ProductWithCustomerPrice | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const quantity = ref(1);

    const loadProduct = async () => {
      try {
        loading.value = true;
        error.value = null;
        const productId = parseInt(route.params.id as string);
        product.value = await productService.getProduct(productId);
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error desconocido';
      } finally {
        loading.value = false;
      }
    };

    const addToCart = () => {
      // TODO: Implementar la funcionalidad del carrito
      console.log('Agregando al carrito:', {
        product: product.value,
        quantity: quantity.value
      });
    };

    onMounted(() => {
      loadProduct();
    });

    return {
      product,
      loading,
      error,
      quantity,
      loadProduct,
      addToCart,
      alertCircleOutline,
      cartOutline,
    };
  },
});
</script>

<style scoped>
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  text-align: center;
  padding: 2rem;
}

.product-slides {
  height: 300px;
}

.product-slides img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pricing-section {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--ion-color-light);
  border-radius: 8px;
}

.price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 1.4em;
  font-weight: bold;
}

.details-section {
  margin: 1rem 0;
}

.details-section h3 {
  margin: 1rem 0;
  color: var(--ion-color-medium);
}

.cart-section {
  margin-top: 2rem;
}

.quantity-input {
  text-align: center;
  max-width: 100px;
}

ion-item {
  --padding-start: 0;
}

ion-list {
  background: transparent;
}

ion-card {
  margin: 0;
  box-shadow: none;
}
</style>
