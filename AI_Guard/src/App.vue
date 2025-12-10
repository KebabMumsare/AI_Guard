<script setup>
import Navbar from './components/Navbar.vue'
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

/* Wave Animations */
.wave-animation-1 {
  animation: wave 15s ease-in-out infinite;
}

.wave-animation-2 {
  animation: wave 20s ease-in-out infinite;
  animation-delay: -5s;
}

.wave-animation-3 {
  animation: wave 25s ease-in-out infinite;
  animation-delay: -10s;
}

@keyframes wave {
  0%, 100% {
    transform: translateX(0) translateY(0) scale(1.1);
  }
  25% {
    transform: translateX(-2%) translateY(-10px) scale(1.12);
  }
  50% {
    transform: translateX(-4%) translateY(-5px) scale(1.1);
  }
  75% {
    transform: translateX(-2%) translateY(-15px) scale(1.12);
  }
}

/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .wave-animation-1,
  .wave-animation-2,
  .wave-animation-3 {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
