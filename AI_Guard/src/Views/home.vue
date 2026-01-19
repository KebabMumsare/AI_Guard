<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const connectionStatus = ref('online')

onMounted(() => {
  document.body.style.overflowY = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflowY = ''
})
</script>

<template>
  <div class="relative flex flex-col lg:flex-row justify-center items-center lg:items-start h-screen px-3 sm:px-4 md:px-6 lg:px-13 gap-1.5 sm:gap-2 md:gap-3 lg:gap-8 overflow-hidden pt-2 sm:pt-4 md:pt-6 lg:pt-30 pb-1 sm:pb-2 md:pb-4">
    <div class="absolute inset-0 -left-[10%] -right-[10%] -bottom-[5%] w-[120%] h-[110%] overflow-hidden pointer-events-none">
      <svg class="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="none" style="width: 100%; height: 100%;">
        <path fill="#8ffe83" fill-opacity="0.3" d="M0,200L48,210C96,220,192,240,288,245C384,250,480,240,576,235C672,230,768,230,864,240C960,250,1056,270,1152,275C1248,280,1344,270,1392,265L1440,260L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-1"></path>
        <path fill="#8ffe83" fill-opacity="0.2" d="M0,250L48,255C96,260,192,270,288,265C384,260,480,240,576,235C672,230,768,240,864,250C960,260,1056,270,1152,270C1248,270,1344,260,1392,255L1440,250L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-2"></path>
        <path fill="#8ffe83" fill-opacity="0.15" d="M0,220L48,225C96,230,192,240,288,245C384,250,480,250,576,245C672,240,768,230,864,230C960,230,1056,240,1152,245C1248,250,1344,250,1392,252L1440,255L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-3"></path>
      </svg>
    </div>
    
    <div class="flex flex-col flex-1 max-w-full lg:max-w-[90rem] relative z-10 mb-2 sm:mb-3 md:mb-4 lg:mb-0">
      <h1 class="text-[#8ffe83] text-xl sm:text-2xl md:text-3xl lg:text-6xl xl:text-8xl 2xl:text-9xl font-bold mb-0.5 sm:mb-1 md:mb-2 lg:mb-3 animate-title">Welcome!</h1>
      <p class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full lg:max-w-3xl leading-tight sm:leading-tight md:leading-snug lg:leading-relaxed mb-0.5 sm:mb-1 animate-text">This is an AI system that uses cameras to detect different instances of events and show them in a graph as well as logging them into a database. The system provides real-time monitoring and analysis of various events captured through camera feeds, allowing you to visualize patterns and trends through interactive graphs. All detected events are automatically logged into a comprehensive database for historical analysis and reporting. Navigate through the dashboard to explore live camera feeds, view detailed event graphs, and access the complete event log.</p>
      <div class="flex flex-row flex-wrap gap-0.5 sm:gap-1 md:gap-2 content-row mb-0.5 sm:mb-1 animate-created">
        <p class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full">Created by:</p>
        <a href="https://github.com/Mykyta-G" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full link-hover-glow">Mykyta-G,</a>
        <a href="https://github.com/eliahdim" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full link-hover-glow">Eliah-D,</a>
        <a href="https://github.com/CarlAxelson" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full link-hover-glow">Carl-A,</a>
        <a href="https://github.com/andigj" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full link-hover-glow">Andi-G &</a>
        <a href="https://github.com/kebabmumsare" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full link-hover-glow">Jesper-A</a>
      </div>
      <button @click="router.push('/live')" class="bg-[#8ffe83] text-black p-1 sm:p-1.5 md:p-2 lg:p-3 rounded-md mt-0.5 sm:mt-1 md:mt-2 lg:mt-3 w-fit text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg animate-button button-hover-glow button-press">Go to Dashboard</button>
    </div>
    <div class="h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[50vh] w-full sm:w-[85%] md:w-[75%] lg:w-[60vh] xl:w-[60vh] bg-black rounded-md overflow-hidden flex-shrink-0 relative z-10 mx-auto lg:mx-0">
      <div class="w-full h-full flex items-center justify-center bg-black">
        <img src="http://192.168.50.26:5500/video_feed" alt="Camera Stream" class="w-full h-full object-contain">
      </div>
      
      <div class="absolute top-1 sm:top-2 left-1 sm:left-2 flex items-center gap-1 sm:gap-2 bg-black bg-opacity-70 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md">
        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full pulse-animation"></div>
        <span class="text-white text-[8px] sm:text-[10px] md:text-xs font-semibold">LIVE</span>
      </div>
      
      <div class="absolute top-1 sm:top-2 right-1 sm:right-2 flex items-center gap-1 sm:gap-2 bg-black bg-opacity-70 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md">
        <div 
          :class="{
            'bg-green-500': connectionStatus === 'online',
            'bg-red-500': connectionStatus === 'offline',
            'bg-yellow-500': connectionStatus === 'connecting'
          }"
          class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
        ></div>
        <span class="text-white text-[8px] sm:text-[10px] md:text-xs capitalize">{{ connectionStatus }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pulse animation for LIVE indicator */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse-animation {
  animation: pulse 1s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Wave animations - optimized for performance */
@keyframes wave-animation {
  0%, 100% {
    transform: translateX(0) scale(1.1);
  }
  50% {
    transform: translateX(-4%) translateY(-2px) scale(1.12);
  }
}

.wave-animation-1 {
  animation: wave-animation 15s ease-in-out infinite;
  transform-origin: center;
}

.wave-animation-2 {
  animation: wave-animation 20s ease-in-out infinite;
  animation-delay: -5s;
  transform-origin: center;
}

.wave-animation-3 {
  animation: wave-animation 25s ease-in-out infinite;
  animation-delay: -10s;
  transform-origin: center;
}

/* Fade-in animations - optimized */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-title {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-text {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

.animate-created {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.5s forwards;
}

.animate-button {
  opacity: 0;
  animation: fadeInLeft 0.8s ease-out 0.7s forwards;
}

.button-hover-glow {
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  position: relative;
  overflow: hidden;
}

.button-hover-glow:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(143, 254, 131, 0.6), 0 0 40px rgba(143, 254, 131, 0.4);
  background-color: #7ae570;
}

.button-hover-glow:active {
  transform: scale(0.98);
}

.button-press {
  position: relative;
}

.button-press::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

.button-press:active::after {
  width: 150px;
  height: 150px;
  opacity: 1;
}

.link-hover-glow {
  transition: color 0.2s ease, text-shadow 0.2s ease;
  text-decoration: none;
  position: relative;
  display: inline-block;
}

.link-hover-glow:hover {
  color: #7ae570;
  text-shadow: 0 0 8px rgba(143, 254, 131, 0.6);
  text-decoration: underline;
}

.flex.flex-col {
  position: relative;
  z-index: 10;
}

/* Performance optimizations */
.absolute.inset-0 {
  contain: layout style paint;
  transform: translateZ(0);
}

.absolute.inset-0 svg {
  isolation: isolate;
}

</style>