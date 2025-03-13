import DashboardView from '@/views/DashboardView.vue';
import PqrView from '@/views/PqrView.vue';
import ReportesView from '@/views/ReportesView.vue';
import TurnosView from '@/views/TurnosView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: '',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
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
