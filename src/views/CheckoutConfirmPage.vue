<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Confirmación de Pago</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Verificando el pago...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <ion-icon :icon="alertCircleOutline" color="danger" size="large"></ion-icon>
        <h2>Error en el Pago</h2>
        <p>{{ error }}</p>
        <ion-button @click="goToCart" color="primary">
          Volver al Carrito
        </ion-button>
      </div>

      <div v-else-if="success" class="success-container">
        <ion-icon :icon="checkmarkCircleOutline" color="success" size="large"></ion-icon>
        <h2>¡Pago Exitoso!</h2>
        <p>Tu orden ha sido procesada correctamente.</p>
        
        <ion-card>
          <ion-card-header>
            <ion-card-title>Detalles de la Transacción</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label>
                  <h3>Orden de Compra</h3>
                  <p>{{ transactionDetails.buy_order }}</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Monto</h3>
                  <p>${{ transactionDetails.amount?.toLocaleString() }}</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Tarjeta</h3>
                  <p>**** **** **** {{ transactionDetails.card_detail?.card_number }}</p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <h3>Código de Autorización</h3>
                  <p>{{ transactionDetails.authorization_code }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-button @click="goToHome" expand="block" class="ion-margin-top">
          Volver al Inicio
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  toastController
} from '@ionic/vue';
import { checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { paymentService } from '@/services/payment.service';
import { cartService } from '@/services/cart.service';

export default defineComponent({
  name: 'CheckoutConfirmPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
    IonIcon,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(true);
    const error = ref('');
    const success = ref(false);
    const transactionDetails = ref<any>({});

    const goToHome = () => {
      router.replace('/');
    };

    const goToCart = () => {
      router.replace('/cart');
    };

    onMounted(async () => {
      const token = route.query.token_ws;
      
      if (!token) {
        error.value = 'Token de transacción no encontrado';
        loading.value = false;
        return;
      }

      try {
        // Confirmar la transacción con Webpay
        const response = await paymentService.confirmTransaction(token as string);
        
        // Según la documentación, response_code === 0 significa transacción aprobada
        if (response.response_code === 0) {
          success.value = true;
          transactionDetails.value = response;
          
          // Limpiar el carrito después de un pago exitoso
          cartService.clearCart();
          
          // Limpiar datos temporales
          localStorage.removeItem('shippingAddress');
          localStorage.removeItem('cartItems');
          
          const toast = await toastController.create({
            message: '¡Pago realizado con éxito!',
            duration: 3000,
            color: 'success',
            position: 'bottom'
          });
          await toast.present();
        } else {
          error.value = 'La transacción no fue autorizada';
        }
      } catch (err) {
        console.error('Error confirming transaction:', err);
        error.value = 'Error al procesar la confirmación del pago';
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      error,
      success,
      transactionDetails,
      goToHome,
      goToCart,
      checkmarkCircleOutline,
      alertCircleOutline
    };
  }
});
</script>

<style scoped>
.loading-container,
.error-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 20px;
}

.error-container ion-icon,
.success-container ion-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-container h2,
.success-container h2 {
  margin-bottom: 10px;
}

ion-card {
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
}

ion-button {
  max-width: 300px;
  margin: 20px auto;
}
</style>
