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
  // Build configuration to ensure GSAP works correctly in production
  build: {
    commonjsOptions: {
      include: [/gsap/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        // Ensure GSAP is not tree-shaken incorrectly
        manualChunks: {
          'gsap': ['gsap']
        }
      }
    }
  },
  optimizeDeps: {
    // Pre-bundle GSAP to ensure it's available
    include: ['gsap']
  },
  // Server configuration for local development
  server: {
    proxy: {
      // Proxy requests starting with '/api' to the backend server
      // This allows us to use relative paths (e.g. fetch('/api/logs')) in the frontend
      // which works seamlessly both locally and on the Pi (via Nginx)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
