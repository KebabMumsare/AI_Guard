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
  -webkit-animation: wave 15s ease-in-out infinite;
  -moz-animation: wave 15s ease-in-out infinite;
  -ms-animation: wave 15s ease-in-out infinite;
  -o-animation: wave 15s ease-in-out infinite;
  animation: wave 15s ease-in-out infinite;
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.wave-animation-2 {
  -webkit-animation: wave 20s ease-in-out infinite;
  -moz-animation: wave 20s ease-in-out infinite;
  -ms-animation: wave 20s ease-in-out infinite;
  -o-animation: wave 20s ease-in-out infinite;
  animation: wave 20s ease-in-out infinite;
  -webkit-animation-delay: -5s;
  -moz-animation-delay: -5s;
  -ms-animation-delay: -5s;
  -o-animation-delay: -5s;
  animation-delay: -5s;
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.wave-animation-3 {
  -webkit-animation: wave 25s ease-in-out infinite;
  -moz-animation: wave 25s ease-in-out infinite;
  -ms-animation: wave 25s ease-in-out infinite;
  -o-animation: wave 25s ease-in-out infinite;
  animation: wave 25s ease-in-out infinite;
  -webkit-animation-delay: -10s;
  -moz-animation-delay: -10s;
  -ms-animation-delay: -10s;
  -o-animation-delay: -10s;
  animation-delay: -10s;
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

@-webkit-keyframes wave {
  0%, 100% {
    -webkit-transform: translate3d(0, 0, 0) scale(1.1);
    transform: translate3d(0, 0, 0) scale(1.1);
  }
  25% {
    -webkit-transform: translate3d(-2%, -10px, 0) scale(1.12);
    transform: translate3d(-2%, -10px, 0) scale(1.12);
  }
  50% {
    -webkit-transform: translate3d(-4%, -5px, 0) scale(1.1);
    transform: translate3d(-4%, -5px, 0) scale(1.1);
  }
  75% {
    -webkit-transform: translate3d(-2%, -15px, 0) scale(1.12);
    transform: translate3d(-2%, -15px, 0) scale(1.12);
  }
}

@-moz-keyframes wave {
  0%, 100% {
    -moz-transform: translate3d(0, 0, 0) scale(1.1);
    transform: translate3d(0, 0, 0) scale(1.1);
  }
  25% {
    -moz-transform: translate3d(-2%, -10px, 0) scale(1.12);
    transform: translate3d(-2%, -10px, 0) scale(1.12);
  }
  50% {
    -moz-transform: translate3d(-4%, -5px, 0) scale(1.1);
    transform: translate3d(-4%, -5px, 0) scale(1.1);
  }
  75% {
    -moz-transform: translate3d(-2%, -15px, 0) scale(1.12);
    transform: translate3d(-2%, -15px, 0) scale(1.12);
  }
}

@-ms-keyframes wave {
  0%, 100% {
    -ms-transform: translate3d(0, 0, 0) scale(1.1);
    transform: translate3d(0, 0, 0) scale(1.1);
  }
  25% {
    -ms-transform: translate3d(-2%, -10px, 0) scale(1.12);
    transform: translate3d(-2%, -10px, 0) scale(1.12);
  }
  50% {
    -ms-transform: translate3d(-4%, -5px, 0) scale(1.1);
    transform: translate3d(-4%, -5px, 0) scale(1.1);
  }
  75% {
    -ms-transform: translate3d(-2%, -15px, 0) scale(1.12);
    transform: translate3d(-2%, -15px, 0) scale(1.12);
  }
}

@-o-keyframes wave {
  0%, 100% {
    -o-transform: translate3d(0, 0, 0) scale(1.1);
    transform: translate3d(0, 0, 0) scale(1.1);
  }
  25% {
    -o-transform: translate3d(-2%, -10px, 0) scale(1.12);
    transform: translate3d(-2%, -10px, 0) scale(1.12);
  }
  50% {
    -o-transform: translate3d(-4%, -5px, 0) scale(1.1);
    transform: translate3d(-4%, -5px, 0) scale(1.1);
  }
  75% {
    -o-transform: translate3d(-2%, -15px, 0) scale(1.12);
    transform: translate3d(-2%, -15px, 0) scale(1.12);
  }
}

@keyframes wave {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1.1);
  }
  25% {
    transform: translate3d(-2%, -10px, 0) scale(1.12);
  }
  50% {
    transform: translate3d(-4%, -5px, 0) scale(1.1);
  }
  75% {
    transform: translate3d(-2%, -15px, 0) scale(1.12);
  }
}

/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .wave-animation-1,
  .wave-animation-2,
  .wave-animation-3 {
    -webkit-animation-duration: 0.01ms !important;
    -moz-animation-duration: 0.01ms !important;
    -ms-animation-duration: 0.01ms !important;
    -o-animation-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    -webkit-animation-iteration-count: 1 !important;
    -moz-animation-iteration-count: 1 !important;
    -ms-animation-iteration-count: 1 !important;
    -o-animation-iteration-count: 1 !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
