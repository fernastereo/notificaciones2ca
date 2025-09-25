import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno
  const pathBase = {
    local: '/',
    staging: '/2ca/admin/',
    prod: '/admin/',
  };
  const env = loadEnv(mode, process.cwd(), '');
  const server = env.VITE_DEPLOY_SERVER || 'local';
  const base = pathBase[server] || '/';
  console.log('🚀 ~ base:', base);

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
    base: base,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});