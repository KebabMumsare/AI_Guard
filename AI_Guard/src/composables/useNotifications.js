import { ref } from 'vue'

const notifications = ref([])
let pollingId = null

// Jetson IP - same as video feed
const JETSON_URL = 'http://192.168.50.26:5500/events'

const fetchEvents = async () => {
  try {
    const res = await fetch(JETSON_URL)
    const events = await res.json()
    for (const event of events) {
      notifications.value.push({
        id: Date.now() + Math.random(),
        event_type: event.event_type,
        description: event.description,
        camera_id: event.camera_id,
        timestamp: new Date(event.timestamp * 1000).toISOString()
      })
    }
  } catch (e) {
    // Jetson unavailable
  }
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const startNotifications = () => {
  pollingId = setInterval(fetchEvents, 1000)
}

const stopNotifications = () => {
  if (pollingId) {
    clearInterval(pollingId)
    pollingId = null
  }
}

export function useNotifications() {
  return {
    notifications,
    removeNotification,
    startNotifications,
    stopNotifications
  }
}
