<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/cart"></ion-back-button>
        </ion-buttons>
        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Procesando tu pago...</p>
      </div>

      <div v-else>
        <ion-card>
          <ion-card-header>
            <ion-card-title>Resumen de Compra</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list>
              <ion-item v-for="item in cart.items" :key="item.product.id">
                <ion-label>
                  <h2>{{ item.product.name }}</h2>
                  <p>Cantidad: {{ item.quantity }}</p>
                </ion-label>
                <ion-note slot="end">${{ (item.product.customer_price * item.quantity).toLocaleString() }}</ion-note>
              </ion-item>

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
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Datos de Envío</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="processCheckout">
              <ion-item>
                <ion-label position="stacked">Dirección de Envío</ion-label>
                <ion-input 
                  v-model="shippingAddress.street" 
                  type="text" 
                  required
                  placeholder="Calle y número">
                </ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Comuna</ion-label>
                <ion-input 
                  v-model="shippingAddress.city" 
                  type="text" 
                  required
                  placeholder="Comuna">
                </ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Región</ion-label>
                <ion-select v-model="shippingAddress.region" interface="action-sheet" required>
                  <ion-select-option value="metropolitana">Región Metropolitana</ion-select-option>
                  <ion-select-option value="valparaiso">Valparaíso</ion-select-option>
                  <!-- Añadir más regiones según necesidad -->
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Teléfono</ion-label>
                <ion-input 
                  v-model="shippingAddress.phone" 
                  type="tel" 
                  required
                  placeholder="Teléfono de contacto">
                </ion-input>
              </ion-item>

              <ion-item lines="none" class="ion-margin-top">
                <ion-button 
                  type="submit" 
                  expand="block"
                  :disabled="loading || !isFormValid"
                >
                  Pagar con Webpay
                  <ion-icon :icon="cardOutline" slot="end"></ion-icon>
                </ion-button>
              </ion-item>
            </form>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
  IonIcon,
  IonButtons,
  IonBackButton,
  toastController
} from '@ionic/vue';
import { cardOutline } from 'ionicons/icons';
import { cartService } from '@/services/cart.service';
import { paymentService } from '@/services/payment.service';

export default defineComponent({
  name: 'CheckoutPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSpinner,
    IonIcon,
    IonButtons,
    IonBackButton
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const cart = computed(() => cartService.getCart());
    const cartTotal = computed(() => cart.value.total);

    const shippingAddress = ref({
      street: '',
      city: '',
      region: '',
      phone: ''
    });

    const isFormValid = computed(() => {
      return shippingAddress.value.street &&
             shippingAddress.value.city &&
             shippingAddress.value.region &&
             shippingAddress.value.phone;
    });

    const processCheckout = async () => {
      try {
        loading.value = true;
        
        // Crear transacción en Webpay
        const transaction = await paymentService.processPayment(cartTotal.value);
        
        // Guardar datos de envío y orden en localStorage
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress.value));
        localStorage.setItem('cartItems', JSON.stringify(cart.value));
        
        // Redirigir a Webpay
        window.location.href = transaction.url;
      } catch (error) {
        console.error('Error processing checkout:', error);
        const toast = await toastController.create({
          message: 'Error al procesar el pago. Por favor, intenta nuevamente.',
          duration: 3000,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      cart,
      cartTotal,
      shippingAddress,
      isFormValid,
      processCheckout,
      cardOutline
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
  text-align: center;
}

ion-button[type="submit"] {
  margin: 20px auto;
  width: 100%;
  max-width: 400px;
}

ion-card {
  margin-bottom: 20px;
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 0.8em;
  margin: 5px 0;
}
</style>
