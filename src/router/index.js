import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import PqrView from '@/views/PqrView.vue';
import ReportesView from '@/views/ReportesView.vue';
import TurnosView from '@/views/TurnosView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/turnos',
      name: 'turnos',
      component: TurnosView,
      meta: { requiresAuth: true },
    },
    {
      path: '/pqr',
      name: 'pqr',
      component: PqrView,
      meta: { requiresAuth: true },
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: ReportesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/PqrView.vue'),
    },
    {
      path: '/:catchall(.*)*',
      name: 'not-found',
      component: 'NotFoundView',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!requiresAuth) {
    if (to.name === 'login' && isAuthenticated.value) {
      next({ name: 'home' });
    } else {
      next();
    }
    return;
  }

  if (!isAuthenticated.value) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  const isValid = await checkAuth();
  if (!isValid) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  next();
});
export default router;
