<template>
  <ion-button fill="clear" @click="goToCart">
    <ion-icon :icon="cartOutline" slot="start"></ion-icon>
    <ion-badge color="danger" v-if="cartSummary.totalItems > 0">
      {{ cartSummary.totalItems }}
    </ion-badge>
    <span v-if="cartSummary.total > 0" class="cart-total">
      ${{ cartSummary.total.toLocaleString() }}
    </span>
  </ion-button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonIcon, IonBadge } from '@ionic/vue';
import { cartOutline } from 'ionicons/icons';
import { cartService } from '@/services/cart.service';
import type { CartSummary } from '@/types/cart.types';

export default defineComponent({
  name: 'CartButton',
  components: {
    IonButton,
    IonIcon,
    IonBadge,
  },
  setup() {
    const router = useRouter();
    const cartSummary = ref<CartSummary>({
      totalItems: 0,
      subtotal: 0,
      total: 0,
      discount: 0,
    });

    // Actualizar el resumen del carrito
    const updateCartSummary = () => {
      cartSummary.value = cartService.getCartSummary();
    };

    // Ir al carrito
    const goToCart = () => {
      router.push('/cart');
    };

    // Observar cambios en el carrito
    const handleCartChange = () => {
      updateCartSummary();
    };

    onMounted(() => {
      // Cargar carrito inicial
      cartService.loadCart();
      updateCartSummary();

      // Escuchar cambios en el carrito
      window.addEventListener('cartChange', handleCartChange);
    });

    onUnmounted(() => {
      window.removeEventListener('cartChange', handleCartChange);
    });

    return {
      cartSummary,
      cartOutline,
      goToCart,
    };
  },
});
</script>

<style scoped>
ion-badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  font-size: 12px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
}

ion-button {
  position: relative;
  --padding-start: 12px;
  --padding-end: 12px;
  height: 40px;
}

ion-icon {
  font-size: 24px;
  margin-right: 4px;
}

.cart-total {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
}
</style>
