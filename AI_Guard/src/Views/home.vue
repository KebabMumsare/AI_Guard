<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.style.overflowY = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflowY = ''
})
</script>

<template>
  <div class="relative flex justify-center items-start h-screen px-8 gap-8 overflow-hidden pt-70">
    <!-- Animated Wave Background - Full Width, Extended Beyond Edges -->
    <div class="absolute inset-0 -left-[10%] -right-[10%] -bottom-[5%] w-[120%] h-[110%] overflow-hidden pointer-events-none">
      <svg class="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 400" preserveAspectRatio="none" style="width: 100%; height: 100%;">
        <path fill="#8ffe83" fill-opacity="0.3" d="M0,200L48,210C96,220,192,240,288,245C384,250,480,240,576,235C672,230,768,230,864,240C960,250,1056,270,1152,275C1248,280,1344,270,1392,265L1440,260L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-1"></path>
        <path fill="#8ffe83" fill-opacity="0.2" d="M0,250L48,255C96,260,192,270,288,265C384,260,480,240,576,235C672,230,768,240,864,250C960,260,1056,270,1152,270C1248,270,1344,260,1392,255L1440,250L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-2"></path>
        <path fill="#8ffe83" fill-opacity="0.15" d="M0,220L48,225C96,230,192,240,288,245C384,250,480,250,576,245C672,240,768,230,864,230C960,230,1056,240,1152,245C1248,250,1344,250,1392,252L1440,255L1440,400L1392,400C1344,400,1248,400,1152,400C1056,400,960,400,864,400C768,400,672,400,576,400C480,400,384,400,288,400C192,400,96,400,48,400L0,400Z" class="wave-animation-3"></path>
      </svg>
    </div>
    
    <!-- Content (relative positioning to appear above waves) -->
    <div class="flex flex-col flex-1 max-w-[90rem] relative z-10">
      <h1 class=" text-[#8ffe83] text-9xl font-bold mb-3">Welcome!</h1>
      <p class="text-[#8ffe83] text-2xl max-w-3xl">This is an AI system that uses cameras to detect different instances of events and show them in a graph as well as logging them into a database. The system provides real-time monitoring and analysis of various events captured through camera feeds, allowing you to visualize patterns and trends through interactive graphs. All detected events are automatically logged into a comprehensive database for historical analysis and reporting. Navigate through the dashboard to explore live camera feeds, view detailed event graphs, and access the complete event log.</p>
      <br>
      <div class="flex flex-row gap-2 content-row">
    <p class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Created by:</p>
      <a href="https://github.com/Mykyta-G" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Mykyta-G,</a>
      <a href="https://github.com/eliahdim" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Eliah-D,</a>
      <a href="https://github.com/Finn-S123" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Finn-S,</a>
      <a href="https://github.com/andigj" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Andi-G &</a>
      <a href="https://github.com/kebabmumsare" class="text-[#8ffe83] text-2xl max-w-3xl line-clamp-6">Jesper-A</a>
      </div>
      <button class="bg-[#8ffe83] text-black p-2 rounded-md mt-3 w-fit">Go to Dashboard</button>
    </div>
    <div class="h-[50vh] w-[60vh] bg-[#8ffe83] rounded-md flex items-center justify-center flex-shrink-0 relative z-10">
      <span class="text-black text-2xl">Image Placeholder</span>
    </div>
  </div>
</template>

<style scoped>
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

/* Ensure content is above waves */
.flex.flex-col {
  position: relative;
  z-index: 10;
}
</style>