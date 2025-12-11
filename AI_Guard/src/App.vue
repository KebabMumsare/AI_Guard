<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import Navbar from './components/Navbar.vue'

onMounted(() => {
  // Wave animations are handled in home.vue component
  // This file doesn't need to initialize them since waves are in child components
})
</script>

<template>
  <div id="app" class="relative">
    <div class="relative z-10">
      <Navbar />
      <router-view />
    </div>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  height: 100vh;
  background-color: #37393B;
  overflow: hidden;
  width: 100%;
}

body {
  @apply bg-neutral-900;
  overflow: hidden;
  height: 100vh;
}

/* Wave Animations - Now handled by GSAP */
.wave-animation-1,
.wave-animation-2,
.wave-animation-3 {
  transform: translate3d(0, 0, 0) scale(1.1);
}
</style>
