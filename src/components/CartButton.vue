<template>
  <ion-button @click="goToCart">
    <ion-icon :icon="cartOutline" slot="start"></ion-icon>
    <ion-badge color="danger" v-if="cartSummary.totalItems > 0">
      {{ cartSummary.totalItems }}
    </ion-badge>
    {{ formatPrice(cartSummary.total) }}
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

    // Formatear precio
    const formatPrice = (price: number): string => {
      return `$${price.toLocaleString()}`;
    };

    // Ir al carrito
    const goToCart = () => {
      router.push('/cart');
    };

    // Observar cambios en el localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        updateCartSummary();
      }
    };

    onMounted(() => {
      // Cargar carrito inicial
      cartService.loadCart();
      updateCartSummary();

      // Escuchar cambios en el localStorage
      window.addEventListener('storage', handleStorageChange);
    });

    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange);
    });

    return {
      cartSummary,
      cartOutline,
      formatPrice,
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
}

ion-button {
  position: relative;
}
</style>
