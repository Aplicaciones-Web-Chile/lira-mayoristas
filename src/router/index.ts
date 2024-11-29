import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { authService } from '@/services/auth.service';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductsPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/OrdersPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await authService.isAuthenticated();
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

export default router;
