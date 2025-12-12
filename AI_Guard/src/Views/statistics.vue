<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BlockGraph from '../components/BlockGraph.vue'
import PageTitle from '../components/PageTitle.vue'
import mockData from '../data/mockData.json'

const events = ref(Array.isArray(mockData) ? mockData : [])

// Log state variables
const logs = ref([])
const loading = ref(true)
const error = ref(null)

// Pagination state
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 15 // Items per page
let intervalId = null

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
    error.value = 'Failed to load logs. Please ensure the backend is running.'
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


// When the component loads...
onMounted(() => {
  fetchLogs(currentPage.value)
  // Refresh current page every 10 seconds
  intervalId = setInterval(() => fetchLogs(currentPage.value), 10000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="graph-page">
    <PageTitle title="Statistics" />
    
    <div class="content-wrapper">
      <div class="graphs-section">
        <div class="graphs-container">
          <BlockGraph :events="events" mode="filtered" />
          <BlockGraph :events="events" mode="highscores" />
        </div>
      </div>
      
      <div class="sidebar-section">
        <div class="log-container">
          <div class="log-header">
            <h2 class="log-title">Event Logs</h2>
            <button @click="fetchLogs(currentPage)" class="refresh-btn" title="Refresh Logs">
              ↻
            </button>
          </div>
          
          <div v-if="loading && logs.length === 0" class="log-status pulse-animation">
            Loading logs...
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
                  <th>Description</th>
                  <th>Camera ID</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in logs" :key="log.id">
                  <td>{{ formatDate(log.timestamp) }}</td>
                  <td class="event-type-cell">{{ log.event_type }}</td>
                  <td>{{ log.description }}</td>
                  <td class="camera-cell">{{ log.camera_id }}</td>
                </tr>
                <tr v-if="logs.length === 0">
                  <td colspan="4" class="no-logs">No logs found.</td>
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
              Previous
            </button>
            
            <span class="pagination-info">
              Page {{ currentPage }} of {{ totalPages }}
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
.graph-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); /* Subtract navbar height */
  max-height: calc(100vh - 60px);
  padding: 20px 20px 40px;
  box-sizing: border-box;
  overflow: hidden;
}

.graph-page :deep(.page-title) {
  flex-shrink: 0;
}

.content-wrapper {
  display: flex;
  flex: 1;
  gap: 1.5vw;
  overflow: hidden;
  min-height: 0; /* Important for flex children to respect overflow */
  box-sizing: border-box;
  justify-content: space-between;
}

.graphs-section {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: auto;
  min-height: 0;
  min-width: 0;
  height: 100%;
  padding-right: 1vw;
}

/* Custom scrollbar for graphs section */
.graphs-section::-webkit-scrollbar {
  width: 8px;
}
.graphs-section::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.1);
}
.graphs-section::-webkit-scrollbar-thumb {
  background: #37393B;
  border-radius: 4px;
}

.graphs-container {
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  width: fit-content;
  min-width: clamp(300px, 45vw, 600px);
  flex: 1;
  min-height: 0;
}

.sidebar-section {
  width: 25vw;
  min-width: 500px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.log-container {
  background-color: #37393B;
  border: 3px solid rgba(143, 254, 131, 0.2);
  padding: 1vh 1vw;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0.625rem 0.625rem 0 rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  min-height: 0;
}

.log-title {
  color: #8ffe83;
  font-weight: bold;
  font-size: clamp(1rem, 2vw, 1.5rem);
  margin: 0 0 1vh 0;
  text-align: center;
  padding-bottom: 0.8vh;
  border-bottom: 2px solid rgba(143, 254, 131, 0.2);
  flex-shrink: 0;
}

.log-status {
  text-align: center;
  color: #8ffe83;
  padding: 1vh 1vw;
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
  margin: 0.5vh 0;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
  font-size: clamp(0.65rem, 1vw, 0.875rem);
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
  padding: 0.6vh 0.5vw;
  text-align: left;
  border-bottom: 2px solid rgba(143, 254, 131, 0.2);
  font-size: clamp(0.7rem, 1.1vw, 0.9rem);
  white-space: nowrap;
}

.log-table td {
  padding: 0.5vh 0.5vw;
  color: #ffffff;
  border-bottom: 1px solid rgba(143, 254, 131, 0.1);
  word-wrap: break-word;
  max-width: 50vw;
  overflow: hidden;
  text-overflow: ellipsis;
}

.log-table tbody tr:hover {
  background-color: rgba(143, 254, 131, 0.1);
  -webkit-transition: background-color 0.2s;
  -moz-transition: background-color 0.2s;
  -ms-transition: background-color 0.2s;
  -o-transition: background-color 0.2s;
  transition: background-color 0.2s;
}

.log-table .event-type-cell {
  color: #8ffe83;
  font-weight: 600;
}

.log-table .camera-cell {
  color: #9ca3af;
  font-size: clamp(0.6rem, 0.9vw, 0.75rem);
}

.log-table .no-logs {
  text-align: center;
  color: #9ca3af;
  font-style: italic;
  padding: 2vh 1vw;
}

.log-table-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.log-table-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border: 0.125rem solid rgba(143, 254, 131, 0.2);
}

.log-table-wrapper::-webkit-scrollbar-thumb {
  background: #8ffe83;
  border: 0.125rem solid rgba(143, 254, 131, 0.3);
  border-radius: 4px;
}

.log-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #7ae570;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1vw;
  padding: 1vh 0;
  flex-shrink: 0;
  border-top: 2px solid rgba(143, 254, 131, 0.2);
  margin-top: 0.5vh;
}

.pagination-btn {
  padding: 0.5vh 1vw;
  background-color: #8ffe83;
  color: #000000;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(0.7rem, 1.2vw, 0.875rem);
  -webkit-transition: background-color 0.2s;
  -moz-transition: background-color 0.2s;
  -ms-transition: background-color 0.2s;
  -o-transition: background-color 0.2s;
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
  font-size: clamp(0.7rem, 1.2vw, 0.875rem);
  white-space: nowrap;
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

/* Medium screens - make sidebar slimmer */
@media (max-width: 1600px) {
  .sidebar-section {
    width: 22vw;
    min-width: 400px;
    max-width: 350px;
  }
  
  .log-container {
    padding: 0.8vh 0.8vw;
  }
  
  .log-table {
    font-size: clamp(0.65rem, 1vw, 0.8rem);
  }
  
  .log-table th,
  .log-table td {
    padding: 0.5vh 0.4vw;
  }
}

/* Smaller screens - more compact */
@media (max-width: 1400px) {
  .sidebar-section {
    width: 20vw;
    min-width: 350px;
    max-width: 320px;
  }
  
  .log-title {
    font-size: clamp(0.9rem, 1.8vw, 1.3rem);
    padding-bottom: 0.6vh;
    margin-bottom: 0.8vh;
  }
  
  .log-container {
    padding: 0.7vh 0.7vw;
  }
  
  .log-table {
    font-size: clamp(0.6rem, 0.95vw, 0.75rem);
  }
  
  .log-table th {
    font-size: clamp(0.65rem, 1vw, 0.85rem);
    padding: 0.5vh 0.3vw;
  }
  
  .log-table td {
    padding: 0.4vh 0.3vw;
  }
  
  .pagination-controls {
    gap: 0.7vw;
    padding: 0.7vh 0;
  }
  
  .pagination-btn {
    padding: 0.4vh 0.7vw;
    font-size: clamp(0.65rem, 1.1vw, 0.8rem);
  }
  
  .pagination-info {
    font-size: clamp(0.65rem, 1.1vw, 0.8rem);
  }
}

/* Mobile/Tablet - stack vertically */
@media (max-width: 1080px) {
  .graph-page {
    height: calc(100vh - 60px);
    padding: 1vh 1vw;
  }
  
  .content-wrapper {
    flex-direction: column;
    gap: 1vh;
  }
  
  .sidebar-section {
    width: 100%;
    min-width: unset;
    max-width: none;
    height: 40vh;
    max-height: 40vh;
  }
  
  .log-container {
    height: 100%;
    padding: 0.8vh 1vw;
  }
  
  .log-table {
    font-size: clamp(0.6rem, 1.5vw, 0.8rem);
  }
  
  .log-table th,
  .log-table td {
    padding: 0.4vh 0.4vw;
  }
  
  .log-table td {
    max-width: 25vw;
  }
  
  .pagination-controls {
    gap: 0.8vw;
    padding: 0.8vh 0;
  }
  
  .pagination-btn {
    padding: 0.4vh 0.8vw;
    font-size: clamp(0.65rem, 1.5vw, 0.8rem);
  }
  
  .graphs-section {
    flex: 1;
    min-height: 0;
    width: 100%;
  }
  
  .graphs-container {
    width: 100%;
    min-width: unset;
    max-width: 100%;
  }
  
  .graphs-section {
    align-items: stretch;
  }
  
}

/* Very small screens */
@media (max-width: 768px) {
  .sidebar-section {
    height: 35vh;
    max-height: 35vh;
  }
  
  .log-container {
    padding: 0.6vh 0.8vw;
  }
  
  .log-title {
    font-size: clamp(0.85rem, 2vw, 1.2rem);
    padding-bottom: 0.5vh;
    margin-bottom: 0.6vh;
  }
  
  .log-table {
    font-size: clamp(0.55rem, 2vw, 0.7rem);
  }
  
  .log-table th {
    font-size: clamp(0.6rem, 2vw, 0.75rem);
    padding: 0.35vh 0.3vw;
  }
  
  .log-table td {
    padding: 0.3vh 0.3vw;
    max-width: 20vw;
  }
  
  .pagination-controls {
    gap: 0.6vw;
    padding: 0.6vh 0;
  }
  
  .pagination-btn {
    padding: 0.35vh 0.6vw;
    font-size: clamp(0.6rem, 2vw, 0.75rem);
  }
  
  .pagination-info {
    font-size: clamp(0.6rem, 2vw, 0.75rem);
  }
}
</style>