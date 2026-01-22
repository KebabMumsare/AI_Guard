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
    <!-- Animated wave background -->
    <div class="absolute inset-0 -left-[10%] -right-[10%] -bottom-[5%] w-[120%] h-[110%] overflow-hidden pointer-events-none animate-wave-rise">
      <svg class="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="none" style="width: 100%; height: 100%;">
        <path class="animate-wave-1" fill="#8ffe83" fill-opacity="0.3" d="M0,200L48,210C96,220,192,240,288,245C384,250,480,240,576,235C672,230,768,230,864,240C960,250,1056,270,1152,275C1248,280,1344,270,1392,265L1440,260L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"></path>
        <path class="animate-wave-2" fill="#8ffe83" fill-opacity="0.2" d="M0,250L48,255C96,260,192,270,288,265C384,260,480,240,576,235C672,230,768,240,864,250C960,260,1056,270,1152,270C1248,270,1344,260,1392,255L1440,250L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"></path>
        <path class="animate-wave-3" fill="#8ffe83" fill-opacity="0.15" d="M0,220L48,225C96,230,192,240,288,245C384,250,480,250,576,245C672,240,768,230,864,230C960,230,1056,240,1152,245C1248,250,1344,250,1392,252L1440,255L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z"></path>
      </svg>
    </div>
    
    <div class="flex flex-col flex-1 max-w-full lg:max-w-[90rem] relative z-10 mb-2 sm:mb-3 md:mb-4 lg:mb-0">
      <!-- Title with slide-up and glow animation -->
      <h1 class="text-[#8ffe83] text-xl sm:text-2xl md:text-3xl lg:text-6xl xl:text-8xl 2xl:text-9xl font-bold mb-0.5 sm:mb-1 md:mb-2 lg:mb-3 animate-title">Welcome!</h1>
      
      <!-- Description with fade-in -->
      <p class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full lg:max-w-3xl leading-tight sm:leading-tight md:leading-snug lg:leading-relaxed mb-0.5 sm:mb-1 animate-fade-in-up" style="animation-delay: 0.2s;">This is an AI system that uses cameras to detect different instances of events and show them in a graph as well as logging them into a database. The system provides real-time monitoring and analysis of various events captured through camera feeds, allowing you to visualize patterns and trends through interactive graphs. All detected events are automatically logged into a comprehensive database for historical analysis and reporting. Navigate through the dashboard to explore live camera feeds, view detailed event graphs, and access the complete event log.</p>
      
      <!-- Credits with staggered animation -->
      <div class="flex flex-row flex-wrap gap-0.5 sm:gap-1 md:gap-2 content-row mb-0.5 sm:mb-1">
        <p class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full animate-fade-in-up" style="animation-delay: 0.4s;">Created by:</p>
        <a href="https://github.com/Mykyta-G" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full hover:underline animate-fade-in-up link-hover" style="animation-delay: 0.5s;">Mykyta-G,</a>
        <a href="https://github.com/eliahdim" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full hover:underline animate-fade-in-up link-hover" style="animation-delay: 0.55s;">Eliah-D,</a>
        <a href="https://github.com/CarlAxelson" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full hover:underline animate-fade-in-up link-hover" style="animation-delay: 0.6s;">Carl-A,</a>
        <a href="https://github.com/andigj" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full hover:underline animate-fade-in-up link-hover" style="animation-delay: 0.65s;">Andi-G &</a>
        <a href="https://github.com/kebabmumsare" class="text-[#8ffe83] text-[10px] sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-2xl max-w-full hover:underline animate-fade-in-up link-hover" style="animation-delay: 0.7s;">Jesper-A</a>
      </div>
      
      <!-- Button with pop-in animation -->
      <button @click="router.push('/live')" class="bg-[#8ffe83] text-black p-1 sm:p-1.5 md:p-2 lg:p-3 rounded-md mt-0.5 sm:mt-1 md:mt-2 lg:mt-3 w-fit text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg hover:bg-[#7ae570] animate-button-pop btn-hover" style="animation-delay: 0.8s;">Go to Dashboard</button>
    </div>
    
    <!-- Live feed with slide-in and glow animation -->
    <div class="h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[50vh] w-full sm:w-[85%] md:w-[75%] lg:w-[60vh] xl:w-[60vh] bg-black rounded-md overflow-hidden flex-shrink-0 relative z-10 mx-auto lg:mx-0 animate-feed-reveal feed-container" style="animation-delay: 0.3s;">
      <div class="w-full h-full flex items-center justify-center bg-black">
        <img src="http://192.168.50.26:5500/video_feed" alt="Camera Stream" class="w-full h-full object-contain">
      </div>
      
      <!-- Live badge with pulse -->
      <div class="absolute top-1 sm:top-2 left-1 sm:left-2 flex items-center gap-1 sm:gap-2 bg-black bg-opacity-70 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md animate-fade-in" style="animation-delay: 0.9s;">
        <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse-live"></div>
        <span class="text-white text-[8px] sm:text-[10px] md:text-xs font-semibold">LIVE</span>
      </div>
      
      <!-- Status badge -->
      <div class="absolute top-1 sm:top-2 right-1 sm:right-2 flex items-center gap-1 sm:gap-2 bg-black bg-opacity-70 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-md animate-fade-in" style="animation-delay: 1s;">
        <div 
          :class="{
            'bg-green-500': connectionStatus === 'online',
            'bg-red-500': connectionStatus === 'offline',
            'bg-yellow-500': connectionStatus === 'connecting'
          }"
          class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-status-pulse"
        ></div>
        <span class="text-white text-[8px] sm:text-[10px] md:text-xs capitalize">{{ connectionStatus }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Title animation - glitch-style reveal with glow */
@keyframes title-reveal {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
    filter: blur(10px);
    text-shadow: 0 0 0 transparent;
  }
  50% {
    opacity: 1;
    transform: translateY(-5px) scale(1.02);
    filter: blur(0);
    text-shadow: 0 0 30px rgba(143, 254, 131, 0.8), 0 0 60px rgba(143, 254, 131, 0.4);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
    text-shadow: 0 0 20px rgba(143, 254, 131, 0.5);
  }
}

.animate-title {
  animation: title-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

/* Fade in up animation */
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

/* Simple fade in */
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
  opacity: 0;
}

/* Button pop animation */
@keyframes button-pop {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  60% {
    transform: scale(1.05) translateY(-2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-button-pop {
  animation: button-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}

/* Button hover effect */
.btn-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(143, 254, 131, 0.4);
}

/* Link hover effect */
.link-hover {
  transition: text-shadow 0.2s ease, transform 0.2s ease;
  display: inline-block;
}

.link-hover:hover {
  text-shadow: 0 0 10px rgba(143, 254, 131, 0.8);
  transform: translateY(-1px);
}

/* Live feed reveal animation */
@keyframes feed-reveal {
  0% {
    opacity: 0;
    transform: scale(0.9) translateX(30px);
    box-shadow: 0 0 0 transparent;
  }
  100% {
    opacity: 1;
    transform: scale(1) translateX(0);
    box-shadow: 0 0 30px rgba(143, 254, 131, 0.3), inset 0 0 0 2px rgba(143, 254, 131, 0.2);
  }
}

.animate-feed-reveal {
  animation: feed-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

/* Feed container glow */
.feed-container {
  transition: box-shadow 0.3s ease;
}

.feed-container:hover {
  box-shadow: 0 0 40px rgba(143, 254, 131, 0.4), inset 0 0 0 2px rgba(143, 254, 131, 0.3);
}

/* Live indicator pulse */
@keyframes pulse-live {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
}

.animate-pulse-live {
  animation: pulse-live 1.5s ease-in-out infinite;
}

/* Status indicator pulse */
@keyframes status-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-status-pulse {
  animation: status-pulse 2s ease-in-out infinite;
}

/* Wave background rise animation */
@keyframes wave-rise {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-wave-rise {
  animation: wave-rise 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Subtle wave floating animations */
@keyframes wave-float-1 {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-15px);
  }
}

@keyframes wave-float-2 {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}

@keyframes wave-float-3 {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-8px);
  }
}

.animate-wave-1 {
  animation: wave-float-1 8s ease-in-out infinite;
}

.animate-wave-2 {
  animation: wave-float-2 6s ease-in-out infinite;
  animation-delay: 0.5s;
}

.animate-wave-3 {
  animation: wave-float-3 7s ease-in-out infinite;
  animation-delay: 1s;
}
</style>