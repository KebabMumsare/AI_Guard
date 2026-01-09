<script setup>
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import Navbar from './components/Navbar.vue'
import NotificationBox from './components/NotificationBox.vue'
import { useNotifications } from './composables/useNotifications'
import MatrixBG from './Assets/MatrixBG.mp4'

const videoRef = ref(null)
const route = useRoute()
const isVideoReady = ref(false)

// Initialize notification system
const { startNotifications, stopNotifications } = useNotifications()

const setPlaybackSpeed = (event) => {
  const video = event?.target || videoRef.value
  if (video) {
    video.playbackRate = 0.5
  }
}

const handleVideoReady = () => {
  isVideoReady.value = true
}

const handleLoadedMetadata = (event) => {
  setPlaybackSpeed(event)
  handleVideoReady()
}

const handleCanPlay = (event) => {
  setPlaybackSpeed(event)
  handleVideoReady()
}

// Pause video during route transitions to improve latency on slower devices
watch(() => route.path, () => {
  if (videoRef.value) {
    videoRef.value.pause()
    // Resume after a short delay to allow route transition to finish :p
    setTimeout(() => {
      if (videoRef.value) {
        videoRef.value.play().catch(() => {})
      }
    }, 100)
  }
})

onMounted(async () => {
  await nextTick()
  if (videoRef.value) {
    setPlaybackSpeed({ target: videoRef.value })
    setTimeout(() => setPlaybackSpeed({ target: videoRef.value }), 100)
    setTimeout(() => setPlaybackSpeed({ target: videoRef.value }), 500)
    setTimeout(() => setPlaybackSpeed({ target: videoRef.value }), 1000)
  }
  // Start notification system
  startNotifications()
})

onUnmounted(() => {
  // Clean up notification system
  stopNotifications()
})
</script>

<template>
  <div id="app" class="relative">
    <!-- Background Video -->
    <div class="video-wrapper">
      <!-- Loading placeholder - shows immediately -->
      <div class="video-placeholder"></div>
      <video
        ref="videoRef"
        class="background-video"
        :class="{ 'video-loaded': isVideoReady }"
        autoplay
        loop
        muted
        playsinline
        preload="metadata"
        @loadedmetadata="handleLoadedMetadata"
        @loadeddata="setPlaybackSpeed"
        @canplay="handleCanPlay"
        @playing="setPlaybackSpeed"
        @play="setPlaybackSpeed"
      >
        <source :src="MatrixBG" type="video/mp4" />
      </video>
      <!-- Dither overlay to break up color banding -->
      <div class="dither-overlay"></div>
    </div>
    
    <div class="relative z-10">
      <Navbar />
      <router-view />
    </div>
    
    <!-- Notification System - App-wide -->
    <NotificationBox />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  height: 100vh;
  background-color: #37393B;
  overflow: hidden;
  width: 100%;
  position: relative;
}

.video-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  will-change: transform;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  z-index: 0;
  transition: opacity 0.5s ease-out;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate3d(-50%, -50%, 0);
  filter: blur(200px) brightness(1) saturate(1.5) contrast(1.1);
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease-in;
  will-change: transform, filter;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.background-video.video-loaded {
  opacity: 1;
}

.video-loaded ~ .video-placeholder {
  opacity: 0;
  pointer-events: none;
}

.dither-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
  background-size: 100px 100px;
  mix-blend-mode: soft-light;
  opacity: 0.6;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

body {
  @apply bg-neutral-900;
  overflow: hidden;
  height: 100vh;
}

/* Wave Animations - Handled by CSS in home.vue */
</style>
