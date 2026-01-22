<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isLive = ref(true)
const isFullscreen = ref(false)
const cameraName = ref('Camera 1')
const connectionStatus = ref('online')
const currentTime = ref(new Date().toLocaleTimeString())
const streamEnabled = ref(true)

// Log state variables (same as statistics page)
const logs = ref([])
const loading = ref(true)
const error = ref(null)

// Pagination state
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 10 // Items per page for live view

let timeInterval = null
let statusInterval = null
let logsInterval = null

// Function to fetch logs from the backend API
const fetchLogs = async (page = 1) => {
  loading.value = true
  try {
    const response = await fetch(`/api/logs?page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch logs')
    
    const data = await response.json()
    logs.value = data.logs
    
    // Update pagination info
    if (data.pagination) {
      currentPage.value = data.pagination.page
      totalPages.value = data.pagination.totalPages
    }
  } catch (err) {
    console.error('Error fetching logs:', err)
    error.value = 'Failed to load logs.'
  } finally {
    loading.value = false
  }
}

// Navigation functions
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchLogs(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchLogs(currentPage.value - 1)
  }
}

// Helper to format the date nicely
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const fetchCameraStatus = async () => {
  try {
    const response = await fetch('http://192.168.50.26:5000/api/camera/status')
    const data = await response.json()
    streamEnabled.value = data.enabled
  } catch (error) {
    console.error('Error fetching camera status:', error)
  }
}

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
  
  fetchCameraStatus()
  statusInterval = setInterval(fetchCameraStatus, 2000)
  
  // Fetch logs immediately and then every 5 seconds
  fetchLogs(currentPage.value)
  logsInterval = setInterval(() => {
    fetchLogs(currentPage.value)
  }, 5000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  if (statusInterval) {
    clearInterval(statusInterval)
  }
  if (logsInterval) {
    clearInterval(logsInterval)
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
    <div class="live-content-wrapper">
      <div class="video-section">
        <div class="video-container relative w-full bg-black overflow-hidden">
          <div class="video-inner">
            <img v-if="streamEnabled" src="http://192.168.50.26:5500/video_feed" alt="Camera Stream" class="w-full h-full object-contain">
            <div v-else class="flex flex-col items-center justify-center text-gray-500 h-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span class="text-xl font-semibold">Camera Disabled</span>
            </div>
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
        </div>
      </div>
      
      <div class="events-sidebar">
        <div class="log-container">
          <div class="log-header">
            <h2 class="log-title">Recent Events</h2>
            <button @click="fetchLogs(currentPage)" class="refresh-btn" title="Refresh Logs">
              ↻
            </button>
          </div>
          
          <div v-if="loading && logs.length === 0" class="log-status pulse-animation">
            Loading events...
          </div>
          
          <div v-else-if="error" class="log-status error">
            {{ error }}
          </div>
          
          <div v-else class="log-table-wrapper">
            <table class="log-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Event Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.id">
                  <td>{{ formatDate(log.timestamp) }}</td>
                  <td class="event-type-cell">{{ log.event_type }}</td>
                </tr>
                <tr v-if="logs.length === 0">
                  <td colspan="2" class="no-logs">No events found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div v-if="!loading && !error && logs.length > 0" class="pagination-controls">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              Prev
            </button>
            
            <span class="pagination-info">
              {{ currentPage }} / {{ totalPages }}
            </span>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-view-container {
  height: calc(100vh - 60px);
  max-height: calc(100vh - 60px);
  padding: 1.25rem 1.25rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

.live-content-wrapper {
  display: flex;
  align-items: stretch;
  gap: 1.25rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding-bottom: 0.75rem;
  padding-right: 0.75rem;
}

.video-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
  overflow: hidden;
}

.video-container {
  position: relative;
  border-radius: 0.5rem;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
}

.video-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
}

.video-inner img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.camera-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  flex-shrink: 0;
  padding-bottom: 0.5rem;
}

.camera-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.camera-name {
  color: #8ffe83;
  font-weight: 600;
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin: 0;
}

.camera-time {
  color: #9ca3af;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  margin: 0;
}

.events-sidebar {
  width: 25%;
  min-width: 280px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: visible;
}

.log-container {
  background-color: #37393B;
  border: 3px solid rgba(143, 254, 131, 0.2);
  border-radius: 0;
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0.625rem 0.625rem 0 rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  min-height: 0;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(143, 254, 131, 0.2);
  flex-shrink: 0;
  margin-bottom: 0.75rem;
}

.log-title {
  color: #8ffe83;
  font-weight: bold;
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin: 0;
}

.refresh-btn {
  background: transparent;
  border: 1px solid rgba(143, 254, 131, 0.3);
  color: #8ffe83;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: rgba(143, 254, 131, 0.1);
  border-color: #8ffe83;
}

.log-status {
  text-align: center;
  color: #8ffe83;
  padding: 1rem;
  flex-shrink: 0;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
}

.log-status.error {
  color: #ef4444;
}

.log-table-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  min-height: 0;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
  font-size: clamp(0.65rem, 1.2vw, 0.875rem);
}

.log-table thead {
  position: sticky;
  top: 0;
  background-color: #37393B;
  z-index: 10;
}

.log-table th {
  color: #8ffe83;
  font-weight: bold;
  padding: 0.5rem 0.5rem;
  text-align: left;
  border-bottom: 2px solid rgba(143, 254, 131, 0.2);
  font-size: clamp(0.7rem, 1.3vw, 0.9rem);
  white-space: nowrap;
}

.log-table td {
  padding: 0.4rem 0.5rem;
  color: #ffffff;
  border-bottom: 1px solid rgba(143, 254, 131, 0.1);
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-table tbody tr {
  transition: background-color 0.2s;
}

.log-table tbody tr:hover {
  background-color: rgba(143, 254, 131, 0.1);
}

.log-table .event-type-cell {
  color: #8ffe83;
  font-weight: 600;
}

.log-table .no-logs {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 2rem 1rem;
}

.log-table-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.log-table-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(143, 254, 131, 0.2);
}

.log-table-wrapper::-webkit-scrollbar-thumb {
  background: #8ffe83;
  border: 2px solid rgba(143, 254, 131, 0.3);
}

.log-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #7ae570;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 0 0;
  flex-shrink: 0;
  border-top: 2px solid rgba(143, 254, 131, 0.2);
  margin-top: 0.5rem;
}

.pagination-btn {
  padding: 0.4rem 0.75rem;
  background-color: #8ffe83;
  color: #000000;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.65rem, 1.2vw, 0.8rem);
  transition: background-color 0.2s;
  white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #7ae570;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #8ffe83;
  font-weight: 600;
  font-size: clamp(0.65rem, 1.2vw, 0.8rem);
  white-space: nowrap;
}

/* Pulse animation */
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

/* Large screens */
@media (min-width: 1600px) {
  .events-sidebar {
    max-width: 450px;
  }
}

/* Medium screens - sidebar becomes slimmer */
@media (max-width: 1400px) {
  .events-sidebar {
    min-width: 260px;
    max-width: 320px;
  }
  
  .log-container {
    padding: 0.875rem;
  }
  
  .log-table {
    font-size: clamp(0.6rem, 1.1vw, 0.8rem);
  }
  
  .log-table th,
  .log-table td {
    padding: 0.4rem 0.4rem;
  }
}

/* Tablet - stack vertically */
@media (max-width: 1080px) {
  .live-view-container {
    padding: 1rem 1rem 1.25rem 1rem;
  }
  
  .live-content-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding-bottom: 0.5rem;
  }
  
  .video-section {
    flex: 1;
    min-height: 0;
  }
  
  .events-sidebar {
    width: 100%;
    min-width: unset;
    max-width: none;
    flex: 0 0 auto;
    max-height: 35vh;
  }
  
  .log-container {
    height: 100%;
    max-height: 100%;
  }
}

/* Small tablet */
@media (max-width: 768px) {
  .live-view-container {
    padding: 0.75rem 0.75rem 1rem 0.75rem;
  }
  
  .live-content-wrapper {
    gap: 0.75rem;
    padding-bottom: 0.5rem;
  }
  
  .events-sidebar {
    max-height: 30vh;
  }
  
  .log-container {
    padding: 0.75rem;
  }
  
  .log-header {
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .log-title {
    font-size: clamp(0.9rem, 4vw, 1.1rem);
  }
  
  .refresh-btn {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
  
  .log-table {
    font-size: clamp(0.6rem, 2.5vw, 0.75rem);
  }
  
  .log-table th {
    font-size: clamp(0.65rem, 2.5vw, 0.8rem);
    padding: 0.35rem 0.3rem;
  }
  
  .log-table td {
    padding: 0.3rem 0.3rem;
  }
  
  .pagination-controls {
    gap: 0.5rem;
    padding-top: 0.5rem;
  }
  
  .pagination-btn {
    padding: 0.35rem 0.6rem;
    font-size: clamp(0.6rem, 2.5vw, 0.75rem);
  }
  
  .pagination-info {
    font-size: clamp(0.6rem, 2.5vw, 0.75rem);
  }
}

/* Mobile */
@media (max-width: 480px) {
  .live-view-container {
    padding: 0.5rem 0.5rem 0.75rem 0.5rem;
  }
  
  .live-content-wrapper {
    gap: 0.5rem;
    padding-bottom: 0.25rem;
  }
  
  .video-section {
    gap: 0.5rem;
  }
  
  .events-sidebar {
    max-height: 28vh;
  }
  
  .log-container {
    padding: 0.5rem;
  }
  
  .log-title {
    font-size: 0.9rem;
  }
  
  .log-table th,
  .log-table td {
    padding: 0.25rem 0.25rem;
  }
}
</style>
