<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="not-found-container">
        <ion-icon :icon="alertCircle" class="error-icon"></ion-icon>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <ion-button @click="goHome" expand="block">
          <ion-icon :icon="home" slot="start"></ion-icon>
          Volver al inicio
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
} from '@ionic/vue';
import { alertCircle, home } from 'ionicons/icons';

export default defineComponent({
  name: 'NotFoundPage',
  components: {
    IonButton,
    IonContent,
    IonIcon,
    IonPage,
  },
  setup() {
    const router = useRouter();

    const goHome = () => {
      router.push('/home');
    };

    return {
      alertCircle,
      home,
      goHome,
    };
  },
});
</script>

<style scoped>
.not-found-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 16px;
}

.error-icon {
  font-size: 64px;
  color: var(--ion-color-danger);
  margin-bottom: 16px;
}

h1 {
  font-size: 72px;
  font-weight: 700;
  color: var(--ion-color-medium);
  margin: 0;
}

h2 {
  font-size: 24px;
  color: var(--ion-color-dark);
  margin: 8px 0;
}

p {
  color: var(--ion-color-medium);
  margin-bottom: 32px;
  max-width: 300px;
}

ion-button {
  max-width: 300px;
  width: 100%;
}
</style>
