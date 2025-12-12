<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PageTitle from '../components/PageTitle.vue'

const activeSection = ref('status')
const alarmEnabled = ref(true)
const systemStatus = ref('online')
const totalEvents = ref(1247)
const eventsToday = ref(23)
const personDetection = ref(true)
const fingerGesture = ref(true)
const unknownObject = ref(true)
const showJetsonIP = ref(false)
const showRaspberryIP = ref(false)
const eyePosition = ref({ x: 0, y: 0 })
const hoveredSpoiler = ref(null)

const handleMouseMove = (event, spoilerId) => {
  hoveredSpoiler.value = spoilerId
  updateEyePosition(event)
}

const handleMouseLeave = () => {
  hoveredSpoiler.value = null
}

const updateEyePosition = (event) => {
  eyePosition.value = { 
    x: event.clientX + 20, 
    y: event.clientY - 20 
  }
}

const handleGlobalMouseMove = (event) => {
  if (hoveredSpoiler.value) {
    updateEyePosition(event)
  }
}


onMounted(() => {
  document.addEventListener('mousemove', handleGlobalMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleGlobalMouseMove)
})

const menuItems = [
  { id: 'status', label: 'Status' },
  { id: 'alarm', label: 'Alarm' },
  { id: 'detection', label: 'Detection' },
  { id: 'system', label: 'System' },
  { id: 'network', label: 'Network' }
]

const toggleAlarm = () => {
  alarmEnabled.value = !alarmEnabled.value
  console.log('Alarm toggled:', alarmEnabled.value ? 'ON' : 'OFF')
}

const clearHistory = () => {
  if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
    totalEvents.value = 0
    eventsToday.value = 0
    console.log('History cleared')
  }
}

const calibrateSystem = () => {
  systemStatus.value = 'calibrating'
  console.log('Calibration started')
  setTimeout(() => {
    systemStatus.value = 'online'
    console.log('Calibration completed')
  }, 3000)
}

const selectSection = (sectionId) => {
  activeSection.value = sectionId
}
</script>

<template>
  <div class="admin-container">
    <PageTitle title="Admin Panel" />
    
    <div class="admin-layout">
      <div class="admin-sidebar">
        <nav class="sidebar-menu">
          <div 
            v-for="item in menuItems" 
            :key="item.id"
            @click="selectSection(item.id)"
            :class="{
              'menu-item': true,
              'menu-item-active': activeSection === item.id
            }"
          >
            {{ item.label }}
          </div>
        </nav>
      </div>

      <div class="admin-main">
        <div v-if="activeSection === 'status'" class="content-panel">
          <h2 class="panel-title">System Status</h2>
          <div class="form-section">
            <div class="form-row">
              <label class="form-label">System Status</label>
              <div class="status-box">
                <span 
                  :class="{
                    'status-dot': true,
                    'status-online': systemStatus === 'online',
                    'status-offline': systemStatus === 'offline',
                    'status-calibrating': systemStatus === 'calibrating'
                  }"
                ></span>
                <span class="status-text">{{ systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1) }}</span>
              </div>
            </div>
            <div class="form-row">
              <label class="form-label">Total Events</label>
              <div class="value-box">{{ totalEvents.toLocaleString() }}</div>
            </div>
            <div class="form-row">
              <label class="form-label">Events Today</label>
              <div class="value-box">{{ eventsToday }}</div>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'alarm'" class="content-panel">
          <h2 class="panel-title">Alarm Settings</h2>
          <div class="form-section">
            <div class="form-row">
              <label class="form-label">Alarm System</label>
              <div class="toggle-wrapper">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="alarmEnabled" @change="toggleAlarm">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-text">{{ alarmEnabled ? 'Enabled' : 'Disabled' }}</span>
              </div>
            </div>
            <div class="form-row">
              <button @click="toggleAlarm" class="router-button">
                {{ alarmEnabled ? 'Disable Alarm' : 'Enable Alarm' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'detection'" class="content-panel">
          <h2 class="panel-title">Detection Settings</h2>
          <div class="form-section">
            <div class="form-row">
              <label class="form-label">Person Detection</label>
              <div class="toggle-wrapper">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="personDetection">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-text">{{ personDetection ? 'Enabled' : 'Disabled' }}</span>
              </div>
            </div>
            <div class="form-row">
              <label class="form-label">Finger Gesture Detection</label>
              <div class="toggle-wrapper">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="fingerGesture">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-text">{{ fingerGesture ? 'Enabled' : 'Disabled' }}</span>
              </div>
            </div>
            <div class="form-row">
              <label class="form-label">Unknown Object Detection</label>
              <div class="toggle-wrapper">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="unknownObject">
                  <span class="toggle-slider"></span>
                </label>
                <span class="toggle-text">{{ unknownObject ? 'Enabled' : 'Disabled' }}</span>
              </div>
            </div>
            <div class="form-row">
              <button class="router-button">Save Settings</button>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'system'" class="content-panel">
          <h2 class="panel-title">System Management</h2>
          <div class="form-section">
            <div class="form-row">
              <label class="form-label">System Calibration</label>
              <button 
                @click="calibrateSystem"
                class="router-button"
                :disabled="systemStatus === 'calibrating'"
              >
                {{ systemStatus === 'calibrating' ? 'Calibrating...' : 'Start Calibration' }}
              </button>
            </div>
            <div class="form-row">
              <label class="form-label">Clear History</label>
              <div class="form-description">This will permanently delete all event logs. This action cannot be undone.</div>
              <button @click="clearHistory" class="router-button router-button-danger">
                Clear All History
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'network'" class="content-panel">
          <h2 class="panel-title">Network Settings</h2>
          <div class="form-section">
            <div class="form-row">
              <label class="form-label">Jetson Nano IP</label>
              <div 
                v-if="showJetsonIP" 
                class="ip-reveal"
                @click="showJetsonIP = false; hoveredSpoiler = null"
              >
                <input type="text" class="router-input" value="192.168.1.100" readonly>
              </div>
              <div 
                v-else 
                class="ip-hidden"
                @click="showJetsonIP = true"
                @mousemove="handleMouseMove($event, 'jetson')"
                @mouseleave="handleMouseLeave"
              >
                <div class="spoiler-placeholder">••••••••••••</div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-label">Raspberry Pi IP</label>
              <div 
                v-if="showRaspberryIP" 
                class="ip-reveal"
                @click="showRaspberryIP = false; hoveredSpoiler = null"
              >
                <input type="text" class="router-input" value="192.168.1.101" readonly>
              </div>
              <div 
                v-else 
                class="ip-hidden"
                @click="showRaspberryIP = true"
                @mousemove="handleMouseMove($event, 'raspberry')"
                @mouseleave="handleMouseLeave"
              >
                <div class="spoiler-placeholder">••••••••••••</div>
              </div>
            </div>
            
            <div 
              v-if="hoveredSpoiler && ((hoveredSpoiler === 'jetson' && !showJetsonIP) || (hoveredSpoiler === 'raspberry' && !showRaspberryIP))"
              class="eye-icon"
              :style="{ 
                left: eyePosition.x + 'px', 
                top: eyePosition.y + 'px',
                transform: 'translate(-50%, -50%)'
              }"
            >
              <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#8ffe83"/>
              </svg>
            </div>
            <div class="form-row">
              <label class="form-label">Connection Status</label>
              <div class="status-box">
                <span class="status-dot status-online"></span>
                <span class="status-text">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  padding: 3vh 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.admin-layout {
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 90rem;
  justify-content: center;
}

.admin-sidebar {
  width: 20rem;
  background-color: #37393B;
  border: 0.2rem solid rgba(143, 254, 131, 0.2);
  border-radius: 0;
  padding: 1.5rem 0;
  flex-shrink: 0;
  box-shadow: 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.3);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
}

.menu-item {
  padding: 1.25rem 2rem;
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: pointer;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -ms-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
  border-left: 0.3rem solid transparent;
}

.menu-item:hover {
  background-color: rgba(143, 254, 131, 0.1);
  color: #8ffe83;
}

.menu-item-active {
  background-color: rgba(143, 254, 131, 0.15);
  color: #8ffe83;
  border-left-color: #8ffe83;
  font-weight: 600;
}

.admin-main {
  flex: 1;
  max-width: 65rem;
}

.content-panel {
  background-color: #37393B;
  border: 0.2rem solid rgba(143, 254, 131, 0.2);
  border-radius: 0;
  padding: 3rem;
  box-shadow: 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.3);
  min-height: 45vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.panel-title {
  font-size: 2rem;
  font-weight: bold;
  color: #8ffe83;
  margin: 0 0 2rem 0;
  padding-bottom: 1.5rem;
  border-bottom: 0.2rem solid rgba(143, 254, 131, 0.2);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.form-label {
  font-size: 1.2rem;
  font-weight: 500;
  color: #9ca3af;
}

.form-description {
  font-size: 1rem;
  color: #9ca3af;
  margin-bottom: 0.75rem;
}

.status-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: inline-block;
}

.status-online {
  background-color: #8ffe83;
  box-shadow: 0 0 0.3rem rgba(143, 254, 131, 0.5);
}

.status-offline {
  background-color: #ef4444;
  box-shadow: 0 0 0.3rem rgba(239, 68, 68, 0.5);
}

.status-calibrating {
  background-color: #fbbf24;
  box-shadow: 0 0 0.3rem rgba(251, 191, 36, 0.5);
}

.status-text {
  font-size: 1.2rem;
  color: #8ffe83;
  font-weight: 500;
}

.value-box {
  font-size: 1.2rem;
  color: #8ffe83;
  font-weight: 600;
  padding: 0.75rem 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 0.15rem solid rgba(143, 254, 131, 0.2);
  border-radius: 0.3rem;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 3.75rem;
  height: 1.875rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  -webkit-transition: 0.3s;
  -moz-transition: 0.3s;
  -ms-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s;
  border-radius: 1.5rem;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.4rem;
  width: 1.4rem;
  left: 0.3rem;
  bottom: 0.3rem;
  background-color: white;
  -webkit-transition: 0.3s;
  -moz-transition: 0.3s;
  -ms-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #8ffe83;
}

input:checked + .toggle-slider:before {
  transform: translateX(2rem);
}

.toggle-text {
  font-size: 1.2rem;
  color: #8ffe83;
  font-weight: 500;
}

.router-input {
  padding: 0.75rem 1rem;
  border: 0.15rem solid rgba(143, 254, 131, 0.2);
  border-radius: 0.3rem;
  font-size: 1.2rem;
  color: #8ffe83;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  box-sizing: border-box;
}

.router-input:focus {
  outline: none;
  border-color: #8ffe83;
  box-shadow: 0 0 0 0.2rem rgba(143, 254, 131, 0.1);
}

.router-input[readonly] {
  background-color: rgba(0, 0, 0, 0.5);
  cursor: not-allowed;
  opacity: 0.7;
}

.router-button {
  padding: 1rem 2rem;
  background-color: #8ffe83;
  color: #000000;
  border: none;
  border-radius: 0.3rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -ms-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
  width: fit-content;
}

.router-button:hover {
  background-color: #7ae570;
  transform: translateY(-0.2rem);
  box-shadow: 0 0.3rem 0.5rem rgba(143, 254, 131, 0.4);
}

.router-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.router-button-danger {
  background-color: #ef4444;
  color: #ffffff;
}

.router-button-danger:hover {
  background-color: #dc2626;
  box-shadow: 0 0.3rem 0.5rem rgba(239, 68, 68, 0.4);
}

.ip-hidden {
  width: 100%;
  cursor: pointer;
  position: relative;
  min-height: 3rem;
}

.spoiler-placeholder {
  padding: 0.75rem 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 0.15rem solid rgba(143, 254, 131, 0.2);
  border-radius: 0.3rem;
  font-size: 1.2rem;
  color: #8ffe83;
  font-family: monospace;
  letter-spacing: 0.2em;
  text-align: center;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -ms-transition: all 0.2s;
  -o-transition: all 0.2s;
  transition: all 0.2s;
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ip-hidden:hover .spoiler-placeholder {
  border-color: rgba(143, 254, 131, 0.5);
  background-color: rgba(0, 0, 0, 0.4);
}

/* FadeIn animation - CSS transition */
.ip-reveal {
  width: 100%;
  cursor: pointer;
  position: relative;
  min-height: 3rem;
  opacity: 1;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.ip-reveal .router-input {
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

.ip-reveal:hover .router-input {
  border-color: rgba(143, 254, 131, 0.5);
}

.eye-icon {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  -webkit-transition: left 0.05s linear, top 0.05s linear;
  -moz-transition: left 0.05s linear, top 0.05s linear;
  -ms-transition: left 0.05s linear, top 0.05s linear;
  -o-transition: left 0.05s linear, top 0.05s linear;
  transition: left 0.05s linear, top 0.05s linear;
  filter: drop-shadow(0 0.2rem 0.3rem rgba(0, 0, 0, 0.5));
  user-select: none;
  width: 1.5rem;
  height: 1.5rem;
}

.eye-icon svg {
  width: 100%;
  height: 100%;
}

@media (max-width: 48rem) {
  .admin-container {
    padding: 2vh 1rem;
  }

  .admin-layout {
    flex-direction: column;
    gap: 2rem;
  }

  .admin-sidebar {
    width: 100%;
    border: 0.2rem solid rgba(143, 254, 131, 0.2);
  }

  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 1rem;
  }

  .menu-item {
    white-space: nowrap;
    border-left: none;
    border-bottom: 0.3rem solid transparent;
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  .menu-item-active {
    border-left: none;
    border-bottom-color: #8ffe83;
  }

  .content-panel {
    padding: 2rem;
    min-height: 60vh;
  }

  .panel-title {
    font-size: 1.75rem;
  }
}
</style>