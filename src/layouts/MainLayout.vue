<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <!-- Menú lateral -->
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Lira Mayoristas</ion-list-header>
            <ion-note>distribuidora@lira.cl</ion-note>

            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item :router-link="p.url" router-direction="root" :lines="'none'" :detail="false" class="hydrated" :class="{ selected: selectedPath === p.url }">
                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>

      <!-- Contenido principal -->
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/vue';
import {
  homeOutline,
  homeSharp,
  cartOutline,
  cartSharp,
  personOutline,
  personSharp,
  documentTextOutline,
  documentTextSharp,
} from 'ionicons/icons';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
    IonRouterOutlet,
    IonSplitPane,
  },
  setup() {
    const selectedPath = ref('');
    const route = useRoute();

    const appPages = [
      {
        title: 'Inicio',
        url: '/home',
        iosIcon: homeOutline,
        mdIcon: homeSharp
      },
      {
        title: 'Productos',
        url: '/products',
        iosIcon: cartOutline,
        mdIcon: cartSharp
      },
      {
        title: 'Pedidos',
        url: '/orders',
        iosIcon: documentTextOutline,
        mdIcon: documentTextSharp
      },
      {
        title: 'Perfil',
        url: '/profile',
        iosIcon: personOutline,
        mdIcon: personSharp
      }
    ];

    selectedPath.value = route.path;

    return {
      selectedPath,
      appPages,
    };
  }
});
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu ion-content ion-list {
  padding: 20px 0;
}

ion-menu ion-note {
  margin-bottom: 30px;
}

ion-menu ion-list-header,
ion-menu ion-note {
  padding-left: 10px;
}

ion-menu ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-item ion-icon {
  color: var(--ion-color-medium);
}

ion-item ion-label {
  font-weight: 500;
}
</style>
