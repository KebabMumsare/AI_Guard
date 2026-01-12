<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PageTitle from '../components/PageTitle.vue'

const isLive = ref(true)
const isFullscreen = ref(false)
const cameraName = ref('Camera 1')
const connectionStatus = ref('online')
const currentTime = ref(new Date().toLocaleTimeString())
const recentEvents = ref([
  { type: 'Motion Detected', time: '14:32:15' },
  { type: 'Person Detected', time: '14:28:42' },
  { type: 'Motion Detected', time: '14:25:10' }
])

let timeInterval = null

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

const toggleFullscreen = () => {
  const videoContainer = document.querySelector('.video-container')
  if (!isFullscreen.value) {
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
  isFullscreen.value = !isFullscreen.value
}

onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})
</script>

<template>
  <div class="live-view-container">
    <PageTitle title="Live Camera Feed" />
    
    <div class="live-content-wrapper">
      <div class="video-section">
        <div class="video-container relative w-full bg-black overflow-hidden">
          <div class="w-full h-full flex items-center justify-center bg-black" style="aspect-ratio: 16/9; min-height: 400px;">
            <img src="http://192.168.50.26:5000/video_feed" alt="Camera Stream" class="w-full h-full object-contain">
          </div>
          
          <div class="absolute top-4 left-4 flex items-center gap-2 bg-black bg-opacity-70 px-3 py-1.5 rounded-md">
            <div class="w-2 h-2 bg-red-500 rounded-full pulse-animation"></div>
            <span class="text-white text-xs sm:text-sm font-semibold">LIVE</span>
          </div>
          
          <div class="absolute top-4 right-4 flex items-center gap-2 bg-black bg-opacity-70 px-3 py-1.5 rounded-md">
            <div 
              :class="{
                'bg-green-500': connectionStatus === 'online',
                'bg-red-500': connectionStatus === 'offline',
                'bg-yellow-500': connectionStatus === 'connecting'
              }"
              class="w-2 h-2 rounded-full"
            ></div>
            <span class="text-white text-xs sm:text-sm capitalize">{{ connectionStatus }}</span>
          </div>
          
          <button 
            @click="toggleFullscreen"
            class="absolute bottom-4 right-4 bg-black bg-opacity-70 hover:bg-opacity-90 text-[#8ffe83] p-2 rounded-md transition-all duration-200 hover:scale-110"
            title="Toggle Fullscreen"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
        
        <div class="camera-info">
          <div class="camera-details">
            <h2 class="camera-name">{{ cameraName }}</h2>
            <p class="camera-time">Current Time: {{ currentTime }}</p>
          </div>
          
          <div class="camera-controls">
            <button class="control-btn settings-btn">
              Settings
            </button>
            <button class="control-btn record-btn">
              Record
            </button>
          </div>
        </div>
      </div>
      
      <div class="events-sidebar">
        <div class="events-container">
          <h2 class="events-title">Recent Events</h2>
          
          <div class="events-list">
            <div 
              v-for="(event, index) in recentEvents" 
              :key="index"
              class="event-item"
            >
              <div class="event-content">
                <span class="event-type">{{ event.type }}</span>
                <span class="event-time">{{ event.time }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="recentEvents.length === 0" class="no-events">
            No recent events
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-view-container {
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.live-content-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  flex: 1;
  max-width: 100%;
}

.video-section {
  flex: 1;
  width: 75%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.video-container {
  position: relative;
  border-radius: 0.5rem;
}

.camera-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.camera-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.camera-name {
  color: #8ffe83;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
}

.camera-time {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
}

.camera-controls {
  display: flex;
  gap: 0.75rem;
}

.control-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -ms-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.settings-btn {
  background-color: #8ffe83;
  color: black;
}

.settings-btn:hover {
  background-color: #7ae570;
}

.record-btn {
  background-color: #37393B;
  color: #8ffe83;
  border: 1px solid rgba(143, 254, 131, 0.3);
}

.record-btn:hover {
  background-color: #2d2f31;
}

.events-sidebar {
  width: 25%;
  min-width: 18.75rem;
  display: flex;
  flex-direction: column;
}

.events-container {
  background-color: #37393B;
  border: 3px solid rgba(143, 254, 131, 0.2);
  border-radius: 0;
  padding: 1.5rem;
  height: 80vh;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0.625rem 0.625rem 0 rgba(0, 0, 0, 0.3);
}

.events-title {
  color: #8ffe83;
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0 0 1.25rem 0;
  text-align: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(143, 254, 131, 0.2);
  flex-shrink: 0;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.3125rem;
  padding-left: 0.3125rem;
  padding-top: 0.3125rem;
  margin-left: -0.3125rem;
  margin-top: -0.3125rem;
}

.events-list::-webkit-scrollbar {
  width: 0.625rem;
}

.events-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border: 0.125rem solid rgba(143, 254, 131, 0.2);
}

.events-list::-webkit-scrollbar-thumb {
  background: #8ffe83;
  border: 0.125rem solid rgba(143, 254, 131, 0.3);
}

.events-list::-webkit-scrollbar-thumb:hover {
  background: #7ae570;
}

.event-item {
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0;
  overflow: visible;
  box-shadow: 0.3125rem 0.3125rem 0 rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(143, 254, 131, 0.2);
  margin-bottom: 0.9375rem;
  position: relative;
  -webkit-transition: all 0.2s ease;
  -moz-transition: all 0.2s ease;
  -ms-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  cursor: pointer;
}

.event-item:hover {
  transform: translate(-0.1875rem, -0.1875rem);
  box-shadow: 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.3);
  border-color: rgba(143, 254, 131, 0.4);
}

.event-content {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 0.5rem;
}

.event-type {
  color: #8ffe83;
  font-weight: 600;
  font-size: 0.875rem;
  flex: 1;
}

.event-time {
  color: #9ca3af;
  font-size: 0.75rem;
  white-space: nowrap;
}

.no-events {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 2rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pulse animation - CSS keyframes */
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

@media (max-width: 75rem) {
  .live-content-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .video-section {
    width: 100% !important;
  }
  
  .events-sidebar {
    width: 100% !important;
    min-width: unset;
  }
  
  .events-container {
    height: auto;
    max-height: 60vh;
  }
}

@media (max-width: 48rem) {
  .live-view-container {
    padding: 1rem;
  }
  
  .camera-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .camera-controls {
    width: 100%;
  }
  
  .control-btn {
    flex: 1;
  }
  
  .events-container {
    max-height: 50vh;
  }
}
</style>