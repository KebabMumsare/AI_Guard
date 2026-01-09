<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '../composables/useNotifications'

const router = useRouter()
const { notifications, removeNotification } = useNotifications()

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

const handleMoreInfo = (notification) => {
  router.push('/live')
}
</script>

<template>
  <div class="notifications-container">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-box"
      >
        <div class="notification-header">
          <span class="notification-type">{{ notification.event_type }}</span>
          <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
        </div>
        <div class="notification-body">
          <p class="notification-description">{{ notification.description }}</p>
          <p class="notification-camera">{{ notification.camera_id }}</p>
        </div>
        <div class="notification-footer">
          <router-link 
            to="/live" 
            class="more-info-link"
            @click="handleMoreInfo(notification)"
          >
            More Info →
          </router-link>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notifications-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  pointer-events: none;
}

.notification-box {
  background-color: #37393B;
  border: 3px solid rgba(143, 254, 131, 0.2);
  padding: 20px 24px;
  box-shadow: 0.625rem 0.625rem 0 rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  min-width: 550px;
  max-width: 600px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(143, 254, 131, 0.2);
}

.notification-type {
  color: #8ffe83;
  font-weight: 600;
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
}

.notification-time {
  color: #9ca3af;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  white-space: nowrap;
}

.notification-body {
  margin-bottom: 12px;
}

.notification-description {
  color: #ffffff;
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.notification-camera {
  color: #9ca3af;
  font-size: clamp(0.85rem, 1.1vw, 0.95rem);
  margin: 0;
}

.notification-footer {
  padding-top: 10px;
  border-top: 1px solid rgba(143, 254, 131, 0.1);
}

.more-info-link {
  color: #8ffe83;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  text-decoration: none;
  font-weight: 600;
  -webkit-transition: color 0.2s;
  -moz-transition: color 0.2s;
  -ms-transition: color 0.2s;
  -o-transition: color 0.2s;
  transition: color 0.2s;
  display: inline-block;
}

.more-info-link:hover {
  color: #7ae570;
}

/* Animation for notifications */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .notifications-container {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .notification-box {
    min-width: unset;
    max-width: none;
    width: 100%;
  }
}
</style>

