<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Menú</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeMenu">
          <ion-icon :icon="closeOutline" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div class="menu-header">
      <ion-avatar>
        <img src="@/assets/logo.png" alt="Logo" />
      </ion-avatar>
      <div class="user-info">
        <h2>{{ user?.name || 'Usuario' }}</h2>
        <p>{{ user?.email }}</p>
      </div>
    </div>

    <ion-list lines="none">
      <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
        <ion-item
          :detail="false"
          :router-link="p.url"
          :class="{ selected: selectedPath === p.url }"
          @click="selectedPath = p.url"
        >
          <ion-icon
            :icon="p.icon"
            slot="start"
            :style="{ color: selectedPath === p.url ? 'var(--ion-color-primary)' : undefined }"
          ></ion-icon>
          <ion-label>{{ p.title }}</ion-label>
        </ion-item>
      </ion-menu-toggle>
    </ion-list>

    <ion-list lines="none" class="bottom-list">
      <ion-menu-toggle auto-hide="false">
        <ion-item button @click="handleLogout" class="logout-item">
          <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
          <ion-label>Cerrar Sesión</ion-label>
        </ion-item>
      </ion-menu-toggle>
    </ion-list>
  </ion-content>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  menuController,
} from '@ionic/vue';
import {
  homeOutline,
  cartOutline,
  documentTextOutline,
  notificationsOutline,
  personOutline,
  logOutOutline,
  closeOutline,
} from 'ionicons/icons';
import { authService } from '@/services/auth.service';
import type { User } from '@/services/auth.service';

const router = useRouter();
const route = useRoute();
const user = ref<User | null>(null);
const selectedPath = ref(route.path);

const appPages = [
  {
    title: 'Inicio',
    url: '/home',
    icon: homeOutline,
  },
  {
    title: 'Productos',
    url: '/products',
    icon: cartOutline,
  },
  {
    title: 'Pedidos',
    url: '/orders',
    icon: documentTextOutline,
  },
  {
    title: 'Notificaciones',
    url: '/notifications',
    icon: notificationsOutline,
  },
  {
    title: 'Mi Perfil',
    url: '/profile',
    icon: personOutline,
  },
];

const closeMenu = async () => {
  await menuController.close();
};

const handleLogout = async () => {
  await authService.logout();
  await menuController.close();
  router.replace('/login');
};

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});
</script>

<style scoped>
.menu-header {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--ion-color-light);
}

ion-avatar {
  width: 48px;
  height: 48px;
}

.user-info h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.user-info p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

ion-list {
  padding: 8px 0;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 48px;
  margin: 4px 8px;
  border-radius: 8px;
}

ion-item.selected {
  --background: var(--ion-color-primary-contrast);
  --color: var(--ion-color-primary);
  font-weight: 500;
}

ion-icon {
  font-size: 20px;
  color: var(--ion-color-medium);
}

.bottom-list {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid var(--ion-color-light-shade);
}

.logout-item {
  --color: var(--ion-color-danger);
}

.logout-item ion-icon {
  color: var(--ion-color-danger);
}
</style>
