<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useNotifications } from '../composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

// Characters to use for the scramble effect
const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

// Current display state
const activeNotification = ref(null)
const displayedEventType = ref('')
const displayedDateTime = ref('')
const isDecrypting = ref(false)

// Animation intervals
let scrambleInterval = null
let decryptTimeout = null

// Format date to 24-hour format with seconds
const formatDateTime = (timestamp) => {
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

// Get a random character
const getRandomChar = () => {
  return glitchChars[Math.floor(Math.random() * glitchChars.length)]
}

// Generate scrambled text of same length
const scrambleText = (text) => {
  return text.split('').map(() => getRandomChar()).join('')
}

// Decrypt animation
const startDecryption = (notification) => {
  activeNotification.value = notification
  isDecrypting.value = true
  
  const targetEventType = notification.event_type.toUpperCase()
  const targetDateTime = formatDateTime(notification.timestamp)
  
  // Track which characters are "locked in"
  const eventTypeLocked = new Array(targetEventType.length).fill(false)
  const dateTimeLocked = new Array(targetDateTime.length).fill(false)
  
  // Initialize with scrambled text
  displayedEventType.value = scrambleText(targetEventType)
  displayedDateTime.value = scrambleText(targetDateTime)
  
  // Calculate total characters to decrypt
  const totalChars = targetEventType.length + targetDateTime.length
  let decryptedCount = 0
  
  // Base interval for scrambling (fast)
  const scrambleSpeed = 30 // ms
  
  // Initial delay between character locks
  let lockDelay = 200 // Start slower
  const minLockDelay = 20 // Fastest lock speed
  const accelerationFactor = 0.85 // How much faster each lock gets
  
  // Scramble non-locked characters continuously
  scrambleInterval = setInterval(() => {
    // Update event type - scramble unlocked chars
    displayedEventType.value = targetEventType.split('').map((char, i) => {
      if (eventTypeLocked[i]) return char
      if (char === ' ') return ' '
      return getRandomChar()
    }).join('')
    
    // Update datetime - scramble unlocked chars
    displayedDateTime.value = targetDateTime.split('').map((char, i) => {
      if (dateTimeLocked[i]) return char
      if (char === ' ' || char === '/' || char === ':') return char
      return getRandomChar()
    }).join('')
  }, scrambleSpeed)
  
  // Lock in characters one by one with accelerating speed
  const lockNextCharacter = () => {
    // Find all unlocked character indices
    const unlockedEventIndices = []
    const unlockedDateIndices = []
    
    eventTypeLocked.forEach((locked, i) => {
      if (!locked && targetEventType[i] !== ' ') unlockedEventIndices.push({ type: 'event', index: i })
    })
    
    dateTimeLocked.forEach((locked, i) => {
      if (!locked && targetDateTime[i] !== ' ' && targetDateTime[i] !== '/' && targetDateTime[i] !== ':') {
        unlockedDateIndices.push({ type: 'date', index: i })
      }
    })
    
    const allUnlocked = [...unlockedEventIndices, ...unlockedDateIndices]
    
    if (allUnlocked.length === 0) {
      // All characters decrypted
      clearInterval(scrambleInterval)
      isDecrypting.value = false
      
      // Keep displayed for a moment then fade out
      setTimeout(() => {
        activeNotification.value = null
        displayedEventType.value = ''
        displayedDateTime.value = ''
        removeNotification(notification.id)
      }, 2500)
      return
    }
    
    // Pick a random unlocked character to lock
    const randomPick = allUnlocked[Math.floor(Math.random() * allUnlocked.length)]
    
    if (randomPick.type === 'event') {
      eventTypeLocked[randomPick.index] = true
    } else {
      dateTimeLocked[randomPick.index] = true
    }
    
    decryptedCount++
    
    // Accelerate the lock speed
    lockDelay = Math.max(minLockDelay, lockDelay * accelerationFactor)
    
    // Schedule next lock
    decryptTimeout = setTimeout(lockNextCharacter, lockDelay)
  }
  
  // Start locking characters after initial scramble
  setTimeout(lockNextCharacter, 400)
}

// Watch for new notifications
watch(notifications, (newNotifications) => {
  if (newNotifications.length > 0 && !activeNotification.value) {
    const latestNotification = newNotifications[newNotifications.length - 1]
    startDecryption(latestNotification)
  }
}, { deep: true })

// Cleanup on unmount
onUnmounted(() => {
  if (scrambleInterval) clearInterval(scrambleInterval)
  if (decryptTimeout) clearTimeout(decryptTimeout)
})
</script>

<template>
  <Transition name="decrypt">
    <div v-if="activeNotification" class="decrypt-container">
      <div class="decrypt-box">
        <div class="decrypt-event-type">{{ displayedEventType }}</div>
        <div class="decrypt-datetime">{{ displayedDateTime }}</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@font-face {
  font-family: 'Dotmax';
  src: url('../Assets/Dotmax.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

.decrypt-container {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  pointer-events: none;
}

.decrypt-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 40px;
  background: transparent;
}

.decrypt-event-type {
  font-family: 'Dotmax', monospace;
  font-size: clamp(1.8rem, 4vw, 3rem);
  color: #8ffe83;
  text-shadow: 
    0 0 5px #8ffe83,
    0 0 10px #8ffe83,
    0 0 20px #8ffe83,
    0 0 40px #6bc962;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  white-space: nowrap;
}

.decrypt-datetime {
  font-family: 'Dotmax', monospace;
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: #8ffe83;
  text-shadow: 
    0 0 3px #8ffe83,
    0 0 6px #8ffe83,
    0 0 12px #8ffe83;
  letter-spacing: 0.1em;
  opacity: 0.85;
  white-space: nowrap;
}

/* Entry/exit animations */
.decrypt-enter-active {
  transition: all 0.3s ease-out;
}

.decrypt-leave-active {
  transition: all 0.5s ease-in;
}

.decrypt-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.decrypt-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* Subtle flicker effect */
@keyframes flicker {
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.8; }
  94% { opacity: 1; }
  96% { opacity: 0.9; }
  97% { opacity: 1; }
}

.decrypt-event-type,
.decrypt-datetime {
  animation: flicker 4s infinite;
}
</style>
