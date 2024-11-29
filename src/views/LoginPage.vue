<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="login-container">
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="Lira Mayoristas" class="logo" />
          <h1>Lira Mayoristas</h1>
          <p>Distribución de Alimentos para Mascotas</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <ion-list>
            <ion-item>
              <ion-label position="floating">Correo electrónico</ion-label>
              <ion-input
                v-model="email"
                type="email"
                required
                placeholder="ejemplo@empresa.cl"
                :disabled="isLoading"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Contraseña</ion-label>
              <ion-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Ingresa tu contraseña"
                :disabled="isLoading"
              ></ion-input>
              <ion-button
                slot="end"
                fill="clear"
                @click="togglePassword"
                :disabled="isLoading"
              >
                <ion-icon
                  slot="icon-only"
                  :icon="showPassword ? eyeOffOutline : eyeOutline"
                ></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>

          <div class="error-message" v-if="error">
            {{ error }}
          </div>

          <ion-button
            expand="block"
            type="submit"
            class="login-button"
            :disabled="isLoading"
          >
            <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
            <span v-else>Iniciar Sesión</span>
          </ion-button>
        </form>

        <div class="support-section">
          <p>¿Necesitas ayuda para acceder?</p>
          <ion-button fill="clear" @click="handleSupport">
            Contacta con soporte
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  toastController,
} from '@ionic/vue';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { authService } from '@/services/auth.service';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    await authService.login(email.value, password.value);
    router.replace('/home');
  } catch (err: any) {
    error.value = err.message || 'Error al iniciar sesión';
    const toast = await toastController.create({
      message: error.value,
      duration: 3000,
      color: 'danger',
      position: 'top',
    });
    await toast.present();
  } finally {
    isLoading.value = false;
  }
};

const handleSupport = () => {
  window.open('mailto:soporte@lira.cl', '_blank');
};
</script>

<style scoped>
.login-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
}

.logo-container h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.logo-container p {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--ion-color-medium);
}

.login-form {
  width: 100%;
}

ion-list {
  background: transparent;
  padding: 0;
  margin-bottom: 1rem;
}

ion-item {
  --background: var(--ion-color-light);
  --border-radius: 8px;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  margin-bottom: 16px;
}

ion-item::part(native) {
  border-radius: 8px;
  border: 1px solid var(--ion-color-light-shade);
}

ion-label {
  --color: var(--ion-color-medium);
}

ion-input {
  --padding-start: 0;
  --padding-end: 0;
  font-size: 16px;
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 14px;
  margin: -8px 0 16px;
  padding: 0 4px;
}

.login-button {
  margin: 16px 0;
  --border-radius: 8px;
  height: 48px;
}

.support-section {
  text-align: center;
  margin-top: 2rem;
}

.support-section p {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--ion-color-medium);
}

ion-button[fill="clear"] {
  --color: var(--ion-color-primary);
  font-weight: 500;
}

@media (max-width: 320px) {
  .login-container {
    padding: 8px;
  }

  .logo {
    width: 100px;
    height: 100px;
  }

  .logo-container h1 {
    font-size: 20px;
  }
}
</style>
