<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div id="app" class="relative">
    <!-- Animated Wave Background - Appears on all pages -->
    <div class="wave-background absolute inset-0 -left-[10%] -right-[10%] -bottom-[5%] w-[120%] h-[110%] overflow-hidden pointer-events-none z-0">
      <svg class="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="none" style="width: 100%; height: 100%;">
        <path fill="#8ffe83" fill-opacity="0.3" d="M0,200L48,210C96,220,192,240,288,245C384,250,480,240,576,235C672,230,768,230,864,240C960,250,1056,270,1152,275C1248,280,1344,270,1392,265L1440,260L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-1"></path>
        <path fill="#8ffe83" fill-opacity="0.2" d="M0,250L48,255C96,260,192,270,288,265C384,260,480,240,576,235C672,230,768,240,864,250C960,260,1056,270,1152,270C1248,270,1344,260,1392,255L1440,250L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-2"></path>
        <path fill="#8ffe83" fill-opacity="0.15" d="M0,220L48,225C96,230,192,240,288,245C384,250,480,250,576,245C672,240,768,230,864,230C960,230,1056,240,1152,245C1248,250,1344,250,1392,252L1440,255L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-3"></path>
      </svg>
    </div>
    
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
