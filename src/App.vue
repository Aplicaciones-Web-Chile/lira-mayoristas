<template>
  <ion-app>
    <ion-menu side="start" content-id="main-content" type="overlay">
      <ion-content>
        <AppMenu />
      </ion-content>
    </ion-menu>
    
    <div class="ion-page" id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>{{ pageTitle }}</ion-title>
          <ion-buttons slot="end">
            <cart-button></cart-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-router-outlet></ion-router-outlet>
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonContent, IonMenu, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/vue';
import AppMenu from '@/components/AppMenu.vue';
import CartButton from '@/components/CartButton.vue';

components: {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  CartButton
},
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
