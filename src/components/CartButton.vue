<template>
  <ion-button fill="clear" @click="goToCart">
    <ion-icon :icon="cartOutline" slot="icon-only"></ion-icon>
    <ion-badge color="danger" v-if="cartSummary.totalItems > 0">
      {{ cartSummary.totalItems }}
    </ion-badge>
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
  top: 5px;
  right: 5px;
  font-size: 12px;
  padding: 2px 4px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
}

ion-button {
  position: relative;
  --padding-start: 8px;
  --padding-end: 8px;
}

ion-icon {
  font-size: 24px;
}
</style>
