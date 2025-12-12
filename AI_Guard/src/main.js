import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { gsap } from 'gsap'

gsap.config({
  nullTargetWarn: false,
  trialWarn: false
})

createApp(App).use(router).mount('#app')
