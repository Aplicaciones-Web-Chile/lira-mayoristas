<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Inicio</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h1>¡Bienvenido, {{ user?.name || 'Usuario' }}!</h1>
        <p v-if="customerType">
          {{ customerType.name }} - {{ customerType.discount_percentage }}% de descuento en todos los productos
        </p>
      </div>

      <!-- Quick Actions -->
      <ion-grid>
        <ion-row>
          <ion-col size="6" size-md="3">
            <ion-card button @click="goToProducts" class="action-card">
              <ion-card-content>
                <ion-icon :icon="cartOutline" size="large"></ion-icon>
                <h2>Ver Productos</h2>
                <p>Explora nuestro catálogo</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="6" size-md="3">
            <ion-card button @click="repeatLastOrder" class="action-card">
              <ion-card-content>
                <ion-icon :icon="repeatOutline" size="large"></ion-icon>
                <h2>Repetir Pedido</h2>
                <p>Último pedido: 28/02/24</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="6" size-md="3">
            <ion-card button @click="goToOrders" class="action-card">
              <ion-card-content>
                <ion-icon :icon="documentTextOutline" size="large"></ion-icon>
                <h2>Mis Pedidos</h2>
                <ion-badge color="primary">2 activos</ion-badge>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="6" size-md="3">
            <ion-card button @click="goToSupport" class="action-card">
              <ion-card-content>
                <ion-icon :icon="helpCircleOutline" size="large"></ion-icon>
                <h2>Soporte</h2>
                <p>¿Necesitas ayuda?</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Featured Products -->
      <ion-card class="featured-section">
        <ion-card-header>
          <ion-card-title>Productos Destacados</ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <swiper
            v-if="featuredProducts.length > 0"
            :modules="[SwiperAutoplay]"
            :slides-per-view="1.2"
            :space-between="10"
            :autoplay="{
              delay: 3000,
              disableOnInteraction: false,
            }"
            :breakpoints="{
              640: {
                slidesPerView: 2.2,
              },
              1024: {
                slidesPerView: 3.2,
              },
            }"
          >
            <swiper-slide v-for="product in featuredProducts" :key="product.id">
              <ion-card class="product-card">
                <img :src="product.images[0]?.src" :alt="product.name" />
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <div class="price-container" v-if="product.customer_price">
                    <div class="original-price">${{ formatPrice(product.price) }}</div>
                    <div class="discount-price">${{ formatPrice(product.customer_price) }}</div>
                  </div>
                  <div class="price-container" v-else>
                    <div class="regular-price">${{ formatPrice(product.price) }}</div>
                  </div>
                  <ion-button size="small" expand="block" @click="goToProduct(product)">
                    Ver Detalles
                  </ion-button>
                </div>
              </ion-card>
            </swiper-slide>
          </swiper>
          <div v-else class="no-products">
            <p>No hay productos destacados disponibles</p>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Recent Orders -->
      <ion-card class="orders-section">
        <ion-card-header>
          <ion-card-title>Pedidos Recientes</ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <ion-list>
            <ion-item v-for="order in recentOrders" :key="order.id" button detail>
              <ion-label>
                <h2>Pedido #{{ order.id }}</h2>
                <p>{{ order.date }}</p>
              </ion-label>
              <ion-badge slot="end" :color="order.status.color">
                {{ order.status.label }}
              </ion-badge>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import {
  cartOutline,
  repeatOutline,
  documentTextOutline,
  helpCircleOutline,
} from 'ionicons/icons';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';
// Import Swiper modules
import { Autoplay } from 'swiper/modules';

import { authService } from '@/services/auth.service';
import { productService } from '@/services/product.service';
import type { User } from '@/services/auth.service';
import type { CustomerType, ProductWithCustomerPrice } from '@/types/product.types';

const router = useRouter();
const user = ref<User | null>(null);
const customerType = ref<CustomerType | null>(null);
const featuredProducts = ref<ProductWithCustomerPrice[]>([]);
const SwiperAutoplay = Autoplay;

// Mock recent orders
const recentOrders = ref([
  {
    id: '12345',
    date: '28/02/2024',
    status: { label: 'Entregado', color: 'success' }
  },
  {
    id: '12346',
    date: '01/03/2024',
    status: { label: 'En Proceso', color: 'primary' }
  }
]);

const loadData = async () => {
  try {
    user.value = await authService.getCurrentUser();
    customerType.value = await productService.getCustomerType();
    featuredProducts.value = (await productService.getProducts())
      .filter(p => p.meta_data?.some(m => m.key === 'featured' && m.value === true))
      .slice(0, 6); // Limitamos a 6 productos destacados
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(price);
};

const goToProducts = () => router.push('/products');
const goToOrders = () => router.push('/orders');
const goToProduct = (product: ProductWithCustomerPrice) => {
  // TODO: Implementar vista de detalle de producto
  console.log('Ver producto:', product);
};
const goToSupport = () => window.open('mailto:soporte@lira.cl', '_blank');
const repeatLastOrder = () => {
  // TODO: Implementar repetición de último pedido
  console.log('Repetir último pedido');
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.welcome-section {
  padding: 24px 16px;
  background: var(--ion-color-light);
  text-align: center;
}

.welcome-section h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.welcome-section p {
  margin: 8px 0 0;
  color: var(--ion-color-medium);
}

.action-card {
  margin: 8px;
  height: 100%;
  text-align: center;
}

.action-card ion-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.action-card ion-icon {
  font-size: 32px;
  color: var(--ion-color-primary);
}

.action-card h2 {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 600;
}

.action-card p {
  margin: 0;
  font-size: 12px;
  color: var(--ion-color-medium);
}

.featured-section, .orders-section {
  margin: 16px;
}

.product-card {
  width: 100%;
  margin: 0;
  border-radius: 8px;
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-info {
  padding: 12px;
}

.product-info h3 {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
}

.price-container {
  margin: 8px 0;
}

.original-price {
  text-decoration: line-through;
  color: var(--ion-color-medium);
  font-size: 12px;
}

.discount-price {
  color: var(--ion-color-success);
  font-weight: 700;
  font-size: 16px;
}

.regular-price {
  color: var(--ion-color-dark);
  font-weight: 600;
  font-size: 16px;
}

ion-badge {
  text-transform: uppercase;
  font-size: 10px;
  padding: 4px 8px;
}

/* Swiper styles */
.swiper {
  padding: 8px;
}

.swiper-slide {
  width: auto;
}

.no-products {
  padding: 24px;
  text-align: center;
  color: var(--ion-color-medium);
}
</style>
