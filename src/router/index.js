import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import PqrView from '@/views/PqrView.vue';
import ReportesView from '@/views/ReportesView.vue';
import TurnosView from '@/views/TurnosView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/turnos',
      name: 'turnos',
      component: TurnosView,
    },
    {
      path: '/pqr',
      name: 'pqr',
      component: PqrView,
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: ReportesView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue'),
    },
  ],
});

export default router;
