import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { gsap } from 'gsap'

// Global GSAP initialization - ensure GSAP is loaded and ready
// This helps prevent race conditions where components try to use GSAP before it's ready
if (typeof window !== 'undefined') {
  // Verify GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.error('[Main] GSAP failed to load! Animations may not work.')
  } else {
    // Register GSAP globally for debugging (optional, can be removed in production)
    if (import.meta.env.DEV) {
      window.gsap = gsap
    }
    
    // Configure GSAP defaults for better cross-browser compatibility
    gsap.config({
      nullTargetWarn: false,
      trialWarn: false
    })
    
    console.log('[Main] GSAP initialized successfully')
  }
}

createApp(App).use(router).mount('#app')
