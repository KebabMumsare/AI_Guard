<script setup>
import { ref, onMounted } from 'vue'
import PageTitle from '../components/PageTitle.vue'

const streamEnabled = ref(true)

const fetchStatus = async () => {
  try {
    const response = await fetch('http://192.168.50.26:5000/api/camera/status')
    const data = await response.json()
    streamEnabled.value = data.enabled
  } catch (error) {
    console.error('Error fetching camera status:', error)
  }
}

const toggleStream = async () => {
  try {
    const response = await fetch('http://192.168.50.26:5000/api/camera/toggle', {
      method: 'POST'
    })
    const data = await response.json()
    streamEnabled.value = data.enabled
    console.log('Stream toggled:', streamEnabled.value ? 'ON' : 'OFF')
  } catch (error) {
    console.error('Error toggling stream:', error)
    // Revert on error
    streamEnabled.value = !streamEnabled.value
  }
}

onMounted(() => {
  fetchStatus()
})
</script>

<template>
  <div class="admin-container">
    <PageTitle title="Admin Panel" />
    
    <div class="admin-card">
      <h2 class="card-title">System Status</h2>
      
      <div class="status-section">
        <div class="status-row">
          <span class="status-label">Video Stream</span>
          <div class="status-indicator">
            <span 
              :class="{
                'status-dot': true,
                'status-running': streamEnabled,
                'status-stopped': !streamEnabled
              }"
            ></span>
            <span class="status-text">{{ streamEnabled ? 'Running' : 'Stopped' }}</span>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="toggle-section">
        <div class="toggle-row">
          <span class="toggle-label">Enable Video Stream</span>
          <div class="toggle-wrapper">
            <label class="toggle-switch">
              <input type="checkbox" v-model="streamEnabled" @change="toggleStream">
              <span class="toggle-slider"></span>
            </label>
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

.admin-card {
  width: 100%;
  max-width: 32rem;
  background-color: #37393B;
  border: 0.2rem solid rgba(143, 254, 131, 0.3);
  border-radius: 0;
  padding: 2.5rem;
  box-shadow: 0.5rem 0.5rem 0 rgba(0, 0, 0, 0.3);
  margin-top: 2rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8ffe83;
  margin: 0 0 2rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.status-section {
  margin-bottom: 1.5rem;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.status-label {
  font-size: 1.1rem;
  color: #9ca3af;
  font-weight: 500;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  display: inline-block;
}

.status-running {
  background-color: #8ffe83;
  box-shadow: 0 0 0.5rem rgba(143, 254, 131, 0.6);
  animation: pulse 2s infinite;
}

.status-stopped {
  background-color: #ef4444;
  box-shadow: 0 0 0.3rem rgba(239, 68, 68, 0.5);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-size: 1.1rem;
  color: #8ffe83;
  font-weight: 600;
}

.divider {
  height: 0.1rem;
  background-color: rgba(143, 254, 131, 0.2);
  margin: 1rem 0;
}

.toggle-section {
  margin-top: 1.5rem;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.toggle-label {
  font-size: 1.1rem;
  color: #9ca3af;
  font-weight: 500;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 3.5rem;
  height: 1.75rem;
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
  background-color: #4b5563;
  transition: 0.3s;
  border-radius: 1.75rem;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.25rem;
  width: 1.25rem;
  left: 0.25rem;
  bottom: 0.25rem;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #8ffe83;
}

input:checked + .toggle-slider:before {
  transform: translateX(1.75rem);
}

@media (max-width: 48rem) {
  .admin-container {
    padding: 2vh 1rem;
  }

  .admin-card {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .status-row,
  .toggle-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>