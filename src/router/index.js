import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
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
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      component: HomeView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '', // Esta será la ruta por defecto -> '/publicaciones'
          name: 'home',
          component: () => import('@/views/PublicacionesView.vue'),
        },
        {
          path: 'publicaciones',
          component: () => import('@/views/PublicacionesView.vue'),
          children: [
            {
              path: '',
              name: 'publicaciones',
              component: () =>
                import('@/components/publicaciones/PublicacionesList.vue'),
            },
            {
              path: 'nuevo',
              name: 'nuevo-publicaciones',
              component: () =>
                import('@/components/publicaciones/PublicacionesForm.vue'),
            },
            {
              path: 'editar/:id',
              name: 'editar-publicaciones',
              component: () =>
                import('@/components/publicaciones/PublicacionesForm.vue'),
            },
          ],
        },
      ],
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
      path: '/:pathMatch(.*)*',
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

  const isValidToken = await checkAuth();
  if (!isValidToken) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  next();
});
export default router;
