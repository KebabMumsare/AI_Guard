import { ref } from 'vue'

const notifications = ref([])
let intervalId = null

// Mock event types and descriptions
const eventTypes = [
  'Motion Detected',
  'Person Detected',
  'Alert',
  'Security Breach',
  'Unauthorized Access',
  'Object Detected'
]

const descriptions = [
  'Movement detected in camera view',
  'Person identified in restricted area',
  'Security alert triggered',
  'Potential security breach detected',
  'Unauthorized access attempt',
  'Unknown object detected'
]

const cameraIds = ['Camera 1', 'Camera 2', 'Camera 3', 'Camera 4', 'Camera 5']

// Generate a random notification
const generateNotification = () => {
  const eventTypeIndex = Math.floor(Math.random() * eventTypes.length)
  const cameraIndex = Math.floor(Math.random() * cameraIds.length)
  
  return {
    id: Date.now() + Math.random(),
    event_type: eventTypes[eventTypeIndex],
    description: descriptions[eventTypeIndex],
    camera_id: cameraIds[cameraIndex],
    timestamp: new Date().toISOString()
  }
}

// Add a new notification
const addNotification = () => {
  const notification = generateNotification()
  notifications.value.push(notification)
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    removeNotification(notification.id)
  }, 3000)
}

// Remove a notification by ID
const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Start the notification system with random intervals (7-10 seconds)
const startNotifications = () => {
  const scheduleNext = () => {
    const delay = Math.random() * 3000 + 7000 // 7-10 seconds
    intervalId = setTimeout(() => {
      addNotification()
      scheduleNext()
    }, delay)
  }
  scheduleNext()
}

// Stop the notification system
const stopNotifications = () => {
  if (intervalId) {
    clearTimeout(intervalId)
    intervalId = null
  }
}

export function useNotifications() {
  return {
    notifications,
    addNotification,
    removeNotification,
    startNotifications,
    stopNotifications
  }
}

