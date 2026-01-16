import { ref } from 'vue'

const notifications = ref([])
let pollingId = null
let lastLogId = 0

const fetchNewLogs = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/logs?limit=10')
    const data = await res.json()
    
    for (const log of data.logs) {
      if (log.id > lastLogId) {
        notifications.value.push({
          id: log.id,
          event_type: log.event_type,
          description: log.description,
          camera_id: log.camera_id,
          timestamp: log.timestamp
        })
        lastLogId = log.id
      }
    }
  } catch (e) {
    // Server unavailable
  }
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const startNotifications = async () => {
  // Initialize lastLogId to current max
  try {
    const res = await fetch('http://localhost:3000/api/logs?limit=1')
    const data = await res.json()
    if (data.logs.length > 0) {
      lastLogId = data.logs[0].id
    }
  } catch (e) {}
  
  pollingId = setInterval(fetchNewLogs, 1000)
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
