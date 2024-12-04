<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/products"></ion-back-button>
        </ion-buttons>
        <ion-title>Carrito de Compras</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="cart-container" v-if="cart.items.length > 0">
        <!-- Lista de productos -->
        <ion-list>
          <ion-item v-for="item in cart.items" :key="item.product.id">
            <ion-thumbnail slot="start" @click="goToProduct(item.product.id)">
              <img :src="item.product.images[0]?.src" :alt="item.product.name" />
            </ion-thumbnail>
            <ion-label>
              <h2>{{ item.product.name }}</h2>
              <p>{{ item.product.categories[0]?.name }}</p>
              <div class="price-container">
                <ion-text color="medium" class="regular-price" v-if="item.product.customer_price < item.product.price">
                  ${{ item.product.price.toLocaleString() }}
                </ion-text>
                <ion-text color="dark" class="final-price">
                  ${{ item.product.customer_price.toLocaleString() }}
                </ion-text>
              </div>
            </ion-label>
            <div class="quantity-controls">
              <ion-button 
                fill="clear"
                @click="updateQuantity(item.product.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
              >
                <ion-icon :icon="removeCircleOutline"></ion-icon>
              </ion-button>
              <ion-input
                type="number"
                v-model="item.quantity"
                @ionChange="updateQuantity(item.product.id, parseInt($event.target.value))"
                min="1"
              ></ion-input>
              <ion-button 
                fill="clear"
                @click="updateQuantity(item.product.id, item.quantity + 1)"
              >
                <ion-icon :icon="addCircleOutline"></ion-icon>
              </ion-button>
            </div>
            <ion-button 
              fill="clear" 
              color="danger"
              @click="removeItem(item.product.id)"
            >
              <ion-icon :icon="trashOutline"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-list>

        <!-- Resumen del carrito -->
        <div class="cart-summary">
          <ion-list>
            <ion-item>
              <ion-label>Subtotal</ion-label>
              <ion-note slot="end">${{ cart.subtotal.toLocaleString() }}</ion-note>
            </ion-item>
            <ion-item v-if="cart.discount > 0">
              <ion-label>Descuento</ion-label>
              <ion-note slot="end" color="success">-${{ cart.discount.toLocaleString() }}</ion-note>
            </ion-item>
            <ion-item>
              <ion-label>Total</ion-label>
              <ion-note slot="end" color="primary">${{ cart.total.toLocaleString() }}</ion-note>
            </ion-item>
          </ion-list>
        </div>

        <!-- Botones de acción -->
        <div class="cart-actions">
          <ion-button expand="block" @click="clearCart" fill="outline" color="medium">
            <ion-icon :icon="trashOutline" slot="start"></ion-icon>
            Vaciar Carrito
          </ion-button>
          <ion-button expand="block" @click="checkout">
            <ion-icon :icon="checkmarkOutline" slot="start"></ion-icon>
            Proceder al Pago
          </ion-button>
        </div>
      </div>

      <!-- Carrito vacío -->
      <div class="empty-cart" v-else>
        <ion-icon :icon="cartOutline" class="empty-cart-icon"></ion-icon>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para comenzar tu compra</p>
        <ion-button expand="block" router-link="/products">
          Ver Productos
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonThumbnail,
  IonInput,
  IonNote,
  IonButtons,
  IonBackButton,
  IonText,
} from '@ionic/vue';
import {
  cartOutline,
  trashOutline,
  addCircleOutline,
  removeCircleOutline,
  checkmarkOutline,
} from 'ionicons/icons';
import { cartService } from '@/services/cart.service';
import type { Cart } from '@/types/cart.types';

export default defineComponent({
  name: 'CartPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonThumbnail,
    IonInput,
    IonNote,
    IonButtons,
    IonBackButton,
    IonText,
  },
  setup() {
    const router = useRouter();
    const cart = ref<Cart>(cartService.getCart());

    // Ir al detalle del producto
    const goToProduct = (productId: number) => {
      router.push(`/products/${productId}`);
    };

    // Actualizar cantidad
    const updateQuantity = (productId: number, quantity: number) => {
      if (quantity > 0) {
        cartService.updateQuantity(productId, quantity);
        cart.value = cartService.getCart();
      }
    };

    // Eliminar item
    const removeItem = (productId: number) => {
      cartService.removeItem(productId);
      cart.value = cartService.getCart();
    };

    // Vaciar carrito
    const clearCart = () => {
      cartService.clearCart();
      cart.value = cartService.getCart();
    };

    // Proceder al pago
    const checkout = () => {
      router.push('/checkout');
    };

    onMounted(() => {
      cartService.loadCart();
      cart.value = cartService.getCart();
    });

    return {
      cart,
      cartOutline,
      trashOutline,
      addCircleOutline,
      removeCircleOutline,
      checkmarkOutline,
      goToProduct,
      updateQuantity,
      removeItem,
      clearCart,
      checkout,
    };
  },
});
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls ion-input {
  width: 60px;
  text-align: center;
}

.cart-summary {
  margin-top: 2rem;
  border-top: 1px solid var(--ion-color-light);
  padding-top: 1rem;
}

.cart-actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-cart {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.empty-cart-icon {
  font-size: 6rem;
  color: var(--ion-color-medium);
  margin-bottom: 1rem;
}

.empty-cart h2 {
  margin: 0;
  color: var(--ion-color-dark);
}

.empty-cart p {
  color: var(--ion-color-medium);
  margin: 0.5rem 0 2rem;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.regular-price {
  text-decoration: line-through;
  font-size: 0.9em;
}

ion-thumbnail {
  cursor: pointer;
}

ion-input {
  --padding-start: 0.5rem;
  --padding-end: 0.5rem;
}
</style>
