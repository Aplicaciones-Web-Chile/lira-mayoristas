<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Pedidos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Pedidos</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Pedidos Activos</ion-label>
          </ion-item-divider>
          
          <!-- Placeholder para pedidos activos -->
          <ion-item>
            <ion-label>
              <h2>Pedido #12345</h2>
              <p>Estado: En proceso</p>
              <p>Fecha: 01/03/2024</p>
            </ion-label>
            <ion-badge slot="end" color="primary">En proceso</ion-badge>
          </ion-item>
        </ion-item-group>

        <ion-item-group>
          <ion-item-divider>
            <ion-label>Historial de Pedidos</ion-label>
          </ion-item-divider>
          
          <!-- Placeholder para historial -->
          <ion-item>
            <ion-label>
              <h2>Pedido #12344</h2>
              <p>Estado: Entregado</p>
              <p>Fecha: 28/02/2024</p>
            </ion-label>
            <ion-badge slot="end" color="success">Entregado</ion-badge>
          </ion-item>
        </ion-item-group>
      </ion-list>

      <!-- Botón flotante para nuevo pedido -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonBadge,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { add } from 'ionicons/icons';

export default defineComponent({
  name: 'OrdersPage',
  components: {
    IonBadge,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonLabel,
    IonList,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    return {
      add,
    };
  },
});
</script>

<style scoped>
ion-item-divider {
  --background: var(--ion-color-light);
  --color: var(--ion-color-medium);
  font-size: 0.9em;
  margin-top: 16px;
}

ion-badge {
  --padding-end: 12px;
  --padding-start: 12px;
  --padding-top: 6px;
  --padding-bottom: 6px;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
}
</style>
