<template>
  <ion-app>
    <ion-menu side="start" content-id="main-content" type="overlay">
      <ion-content>
        <AppMenu />
      </ion-content>
    </ion-menu>
    
    <ion-router-outlet id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonContent, IonMenu, IonRouterOutlet } from '@ionic/vue';
import AppMenu from '@/components/AppMenu.vue';
</script>

<style>
/* Estilos globales */
:root {
  --ion-color-primary: #dc1e2d;
  --ion-color-primary-rgb: 220,30,45;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255,255,255;
  --ion-color-primary-shade: #c21a28;
  --ion-color-primary-tint: #e03542;
}

ion-menu {
  --width: 280px;
  --background: var(--ion-background-color);
}

ion-menu::part(backdrop) {
  background-color: rgba(0, 0, 0, 0.5);
}

ion-item {
  --background: transparent;
}

/* Animaciones suaves */
.ion-page {
  animation: fadein 0.3s ease-in-out;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
