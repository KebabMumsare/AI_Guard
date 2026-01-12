import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Server configuration for local development
  server: {
    host: '192.168.50.161',
    port: 5000,
    proxy: {
      
      // Proxy requests starting with '/api' to the backend server
      // This allows us to use relative paths (e.g. fetch('/api/logs')) in the frontend
      // which works seamlessly both locally and on the Pi (via Nginx)
      '/api': {
        target: '192.168.50.161:3000',
        changeOrigin: true,
      },
    },
  },
})
