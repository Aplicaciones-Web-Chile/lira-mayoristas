<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Perfil</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="profile-container">
        <!-- Avatar y nombre -->
        <div class="profile-header">
          <ion-avatar>
            <img :alt="user?.name" src="https://gravatar.com/avatar/placeholder?d=mp" />
          </ion-avatar>
          <h2>{{ user?.name }}</h2>
          <p>{{ user?.email }}</p>
        </div>

        <!-- Información del perfil -->
        <ion-list>
          <ion-item-group>
            <ion-item-divider>
              <ion-label>Información Personal</ion-label>
            </ion-item-divider>

            <ion-item>
              <ion-label>
                <h3>Nombre</h3>
                <p>{{ user?.name }}</p>
              </ion-label>
              <ion-button fill="clear" slot="end">
                <ion-icon :icon="pencil" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3>Email</h3>
                <p>{{ user?.email }}</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3>Teléfono</h3>
                <p>{{ user?.phone || 'No especificado' }}</p>
              </ion-label>
              <ion-button fill="clear" slot="end">
                <ion-icon :icon="pencil" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-item>

            <ion-item v-if="user?.company">
              <ion-label>
                <h3>Empresa</h3>
                <p>{{ user.company }}</p>
              </ion-label>
            </ion-item>
          </ion-item-group>

          <ion-item-group>
            <ion-item-divider>
              <ion-label>Preferencias</ion-label>
            </ion-item-divider>

            <ion-item>
              <ion-label>Notificaciones</ion-label>
              <ion-toggle slot="end"></ion-toggle>
            </ion-item>

            <ion-item>
              <ion-label>Tema Oscuro</ion-label>
              <ion-toggle slot="end"></ion-toggle>
            </ion-item>
          </ion-item-group>
        </ion-list>

        <!-- Botón de cerrar sesión -->
        <div class="logout-button">
          <ion-button color="danger" expand="block" @click="handleLogout">
            <ion-icon :icon="logOut" slot="start"></ion-icon>
            Cerrar Sesión
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
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
  IonToggle,
  IonToolbar,
} from '@ionic/vue';
import { logOut, pencil } from 'ionicons/icons';
import { authService } from '@/services/auth.service';

export default defineComponent({
  name: 'ProfilePage',
  components: {
    IonAvatar,
    IonButton,
    IonButtons,
    IonContent,
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
    IonToggle,
    IonToolbar,
  },
  setup() {
    const router = useRouter();
    const user = ref(null);

    onMounted(async () => {
      user.value = await authService.getCurrentUser();
    });

    const handleLogout = async () => {
      authService.logout();
      await router.push('/login');
    };

    return {
      handleLogout,
      logOut,
      pencil,
      user,
    };
  },
});
</script>

<style scoped>
.profile-container {
  padding: 16px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.profile-header ion-avatar {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.profile-header h2 {
  margin: 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.profile-header p {
  margin: 0;
  color: var(--ion-color-medium);
}

ion-item-divider {
  --background: var(--ion-color-light);
  --color: var(--ion-color-medium);
  font-size: 0.9em;
  margin-top: 16px;
}

.logout-button {
  margin-top: 32px;
  padding: 0 16px;
}
</style>
