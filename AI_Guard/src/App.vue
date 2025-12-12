<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import Navbar from './components/Navbar.vue'
import MatrixBG from './Assets/MatrixBG.mp4'

const videoRef = ref(null)

const setPlaybackSpeed = (event) => {
  const video = event?.target || videoRef.value
  if (video) {
    video.playbackRate = 0.8
  }
}

onMounted(async () => {
  await nextTick()
  if (videoRef.value) {
    setPlaybackSpeed({ target: videoRef.value })
    // Try multiple times to ensure it sticks
    setTimeout(() => setPlaybackSpeed({ target: videoRef.value }), 100)
    setTimeout(() => setPlaybackSpeed({ target: videoRef.value }), 500)
    setTimeout(() => setPlaybackSpeed({ target: videoRef.value }), 1000)
  }
})
</script>

<template>
  <div id="app" class="relative">
    <!-- Background Video -->
    <div class="video-wrapper">
      <video
        ref="videoRef"
        class="background-video"
        autoplay
        loop
        muted
        playsinline
        @loadedmetadata="setPlaybackSpeed"
        @loadeddata="setPlaybackSpeed"
        @canplay="setPlaybackSpeed"
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
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  filter: blur(200px) brightness(1.2) saturate(1.5) contrast(1.1);
  object-fit: cover;
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
}

body {
  @apply bg-neutral-900;
  overflow: hidden;
  height: 100vh;
}

/* Wave Animations - Handled by CSS in home.vue */
</style>
