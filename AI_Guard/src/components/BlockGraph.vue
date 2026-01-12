<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  mode: {
    type: String,
    default: 'filtered', // 'filtered', 'total', or 'highscores'
    validator: (value) => ['filtered', 'total', 'highscores'].includes(value)
  }
})

const emit = defineEmits(['bar-click'])

// Get unique event types from the events
const eventTypes = computed(() => {
  const unique = [...new Set(props.events.map(e => e.eventName))]
  return unique.sort()
})

// Selected event (defaults to first event type) - only used in 'filtered' mode
// 'TOTAL' is a special value that means show all events combined
const selectedEvent = ref('')

// Initialize selectedEvent when eventTypes are available
watch(eventTypes, (newTypes) => {
  if (newTypes.length > 0 && !newTypes.includes(selectedEvent.value) && selectedEvent.value !== 'TOTAL') {
    selectedEvent.value = newTypes[0]
  }
}, { immediate: true })

// Check if showing total events
const isTotalEvents = computed(() => selectedEvent.value === 'TOTAL')

// Get current week structure (Monday to Sunday)
const getCurrentWeek = () => {
  const today = new Date()
  const day = today.getDay()
  // Get Monday of current week (day 0 = Sunday, so we adjust)
  const monday = new Date(today)
  const diff = day === 0 ? -6 : 1 - day // If Sunday, go back 6 days, otherwise go to Monday
  monday.setDate(today.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  
  const week = []
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const dateKey = date.toISOString().split('T')[0]
    
    week.push({
      date: dateKey,
      dayName: dayNames[i],
      count: 0
    })
  }
  
  return week
}

// Process event data based on mode
const data = computed(() => {
  if (props.mode === 'highscores') {
    // Calculate total counts per event type
    const eventCounts = {}
    props.events.forEach(event => {
      if (!eventCounts[event.eventName]) {
        eventCounts[event.eventName] = 0
      }
      eventCounts[event.eventName]++
    })
    
    // Convert to array and sort by count (descending)
    return eventTypes.value.map(eventType => ({
      label: eventType,
      count: eventCounts[eventType] || 0
    })).sort((a, b) => b.count - a.count)
  }
  
  // For 'total' and 'filtered' modes, show weekly data
  const eventsToProcess = props.mode === 'total' || (props.mode === 'filtered' && isTotalEvents.value)
    ? props.events 
    : props.events.filter(e => e.eventName === selectedEvent.value)
  
  const groupedByDate = {}
  eventsToProcess.forEach(event => {
    const date = new Date(event.timestamp)
    const dateKey = date.toISOString().split('T')[0]
    
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = {
        date: dateKey,
        count: 0
      }
    }
    groupedByDate[dateKey].count++
  })
  
  // Get current week structure
  const currentWeek = getCurrentWeek()
  
  // Fill in counts for each day of the week
  currentWeek.forEach(day => {
    day.count = groupedByDate[day.date]?.count || 0
  })
  
  return currentWeek
})

// Max value is the highest bar + 10, rounded to nearest 10
const maxValue = computed(() => {
  if (data.value.length === 0) return 10
  const max = Math.max(...data.value.map(d => d.count), 0)
  const valueWithPadding = max + 10
  return Math.round(valueWithPadding / 10) * 10 || 10
})

// Y-axis values at every 20% of maxValue
const yAxisValues = computed(() => {
  const max = maxValue.value
  const step = max * 0.2 // 20% of max
  const values = []
  
  // 0 to max at 20% intervals on Y-axis
  for (let i = 0; i <= max; i += step) {
    values.push(Math.round(i))
  }
  
  // Ensure max is included on da Y-axis
  if (values[values.length - 1] !== max) {
    values.push(max)
  }
  
  // Return in descending order to display the y-axis
  return values.reverse()
})

// Check if a day is today (only for weekly view)
const isCurrentDay = (dayName) => {
  if (props.mode === 'highscores') return false
  const today = new Date()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayName = dayNames[today.getDay()]
  return dayName === todayName
}

// Get label for display
const getLabel = (item) => {
  if (props.mode === 'highscores') {
    return item.label
  }
  return item.dayName
}

</script>

<template>
  <div class="block-graph">
    <div class="graph-header">
      <div v-if="mode === 'filtered'" class="event-badges">
        <button
          @click="selectedEvent = 'TOTAL'"
          class="event-badge"
          :class="{ active: isTotalEvents }"
        >
          Total Events
        </button>
        <button
          v-for="eventType in eventTypes"
          :key="eventType"
          @click="selectedEvent = eventType"
          class="event-badge"
          :class="{ active: selectedEvent === eventType }"
        >
          {{ eventType }} Events
        </button>
      </div>
      <div v-else-if="mode === 'total'" class="graph-title-text">
        Total Events
      </div>
      <div v-else-if="mode === 'highscores'" class="graph-title-text">
        Total Events (All-Time)
      </div>
    </div>
    
    <div class="graph-wrapper">
      <div class="graph-main">
        <!-- Y-axis -->
        <div class="y-axis-container">
          <div 
            v-for="(value, index) in yAxisValues" 
            :key="index"
            class="y-axis-label"
            :style="{ 
              bottom: `${(value / maxValue) * 100}%`
            }"
          >
            {{ value }}
          </div>
        </div>
        
        <!-- Bars container -->
        <div class="bars-container">
          <!-- Grid lines -->
          <div class="grid-lines">
            <div 
              v-for="(value, index) in yAxisValues" 
              :key="index"
              class="grid-line"
              :style="{ 
                bottom: `${(value / maxValue) * 100}%`
              }"
            ></div>
          </div>
          
          <!-- Bars -->
          <div 
            v-for="(item, index) in data" 
            :key="index" 
            class="bar-wrapper"
          >
            <div 
              v-if="item.count > 0"
              class="bar"
              :class="{ 'bar-current': mode !== 'highscores' && isCurrentDay(item.dayName) }"
              :style="{ 
                height: `${(item.count / maxValue) * 100}%`
              }"
              :title="mode === 'highscores' ? `${item.count} ${item.label} events` : `${item.count} on ${item.dayName}`"
              @click="emit('bar-click', { mode, item, selectedEvent: mode === 'filtered' ? selectedEvent : null })"
            >
              <span class="bar-value">{{ item.count }}</span>
              <!-- Star on bar when today has data -->
              <template v-if="mode !== 'highscores' && isCurrentDay(item.dayName)">
                <span class="center-star"></span>
                <span v-for="n in 5" :key="n" :class="['star-glow-layer', `star-glow-${n}`]"></span>
              </template>
            </div>
            <!-- Empty bar with star when today has 0 events -->
            <div v-else class="bar-empty" :class="{ 'bar-empty-current': mode !== 'highscores' && isCurrentDay(item.dayName) }">
              <template v-if="mode !== 'highscores' && isCurrentDay(item.dayName)">
                <span class="center-star"></span>
                <span v-for="n in 5" :key="n" :class="['star-glow-layer', `star-glow-${n}`]"></span>
              </template>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Labels -->
      <div class="labels-container">
        <div 
          v-for="(item, index) in data" 
          :key="index" 
          class="day-label"
        >
          {{ getLabel(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.block-graph {
  background-color: #37393B;
  border: 3px solid rgba(143, 254, 131, 0.2);
  border-radius: 0;
  padding: clamp(1rem, 2vh, 20px);
  display: flex;
  flex-direction: column;
  width: clamp(300px, 45vw, 600px);
  flex: 1;
  min-height: 350px;
  box-shadow: 0.625rem 0.625rem 0 rgba(0, 0, 0, 0.3);
}

@media (max-width: 1080px) {
  .block-graph {
    width: 100%;
    min-height: clamp(300px, 40vh, 500px);
    max-height: none;
  }
}

.graph-header {
  margin-bottom: clamp(0.8rem, 1.5vh, 16px);
  padding-bottom: clamp(0.6rem, 1vh, 12px);
  border-bottom: 2px solid rgba(143, 254, 131, 0.2);
}

.event-badges {
  display: flex;
  gap: clamp(0.5rem, 1vw, 12px);
  flex-wrap: wrap;
}

.graph-title-text {
  color: #8ffe83;
  font-size: clamp(1rem, 1.8vw, 18px);
  font-weight: bold;
}

.event-badge {
  padding: clamp(0.4rem, 0.8vh, 8px) clamp(0.8rem, 1.5vw, 16px);
  background-color: rgba(0, 0, 0, 0.3);
  color: #8ffe83;
  border: 2px solid rgba(143, 254, 131, 0.2);
  border-radius: 0;
  font-size: clamp(0.75rem, 1.4vw, 14px);
  font-weight: 600;
  cursor: pointer;
  -webkit-transition: all 0.2s ease;
  -moz-transition: all 0.2s ease;
  -ms-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.2);
}

.event-badge:hover {
  background-color: rgba(143, 254, 131, 0.15);
  border-color: rgba(143, 254, 131, 0.4);
  transform: translate(-2px, -2px);
  box-shadow: 0.35rem 0.35rem 0 rgba(0, 0, 0, 0.25);
}

.event-badge.active {
  background-color: #8ffe83;
  color: #000000;
  border-color: #8ffe83;
  font-weight: bold;
  box-shadow: 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.3);
}

.graph-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: clamp(150px, 25vh, 180px);
}

.graph-main {
  display: flex;
  gap: clamp(0.5rem, 1.2vw, 12px);
  flex: 1;
  min-height: 0;
  align-items: stretch;
}

/* Y-axis */
.y-axis-container {
  position: relative;
  padding-right: clamp(0.3rem, 0.8vw, 8px);
  flex-shrink: 0;
  align-self: stretch;
}

.y-axis-label {
  position: absolute;
  right: 0;
  font-size: clamp(0.6rem, 1.1vw, 11px);
  color: #8ffe83;
  text-align: right;
  font-weight: 500;
  line-height: 1;
  transform: translateY(50%);
}

.bars-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(0.5rem, 1.2vw, 12px);
  flex: 1;
  min-height: 0;
  position: relative;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: rgba(143, 254, 131, 0.15);
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
  align-self: stretch;
}

.bar {
  width: 35%;
  background: linear-gradient(to top, #4a8a42, #6fcf64, #8ffe83);
  border-radius: clamp(2px, 0.4vw, 4px) clamp(2px, 0.4vw, 4px) 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: clamp(0.3rem, 0.6vh, 6px);
  position: relative;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  box-shadow: 0 clamp(1px, 0.2vh, 2px) clamp(2px, 0.4vh, 4px) rgba(0, 0, 0, 0.2);
}

.bar:hover {
  background: linear-gradient(to top, #5a9a52, #7fdf74, #9fff93);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(143, 254, 131, 0.3);
}

.bar-current {
  background: linear-gradient(to top, #5faa57, #7fdf74, #9fff93) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.center-star {
  position: absolute;
  top: clamp(-6px, -0.9vh, -9px);
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(8px, 1.2vw, 12px);
  height: clamp(8px, 1.2vw, 12px);
  background: #06B48B;
  clip-path: polygon(50% 0%, 61.8% 38.2%, 100% 50%, 61.8% 61.8%, 50% 100%, 38.2% 61.8%, 0% 50%, 38.2% 38.2%);
  z-index: 5;
  pointer-events: none;
  opacity: 1;
}

/* Pulse-brightness animation - CSS keyframes */
@keyframes star-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

.star-glow-layer {
  position: absolute;
  top: clamp(-6px, -0.9vh, -9px);
  left: 50%;
  width: clamp(24px, 3.6vw, 36px);
  clip-path: polygon(50% 0%, 61.8% 38.2%, 100% 50%, 61.8% 61.8%, 50% 100%, 38.2% 61.8%, 0% 50%, 38.2% 38.2%);
  transform: translate3d(-50%, -50%, 0);
  pointer-events: none;
  opacity: 1;
  animation: star-pulse 1s ease-in-out infinite;
}


.center-star {
  animation: star-pulse 1s ease-in-out infinite;
}

.star-glow-1 {
  height: clamp(18px, 2.7vw, 27px);
  background: rgba(6, 180, 139, 0.8);
  filter: blur(clamp(4px, 0.6vw, 6px));
  z-index: 1;
  transform: translate(-50%, -50%) scaleX(0.8);
}

.star-glow-2 {
  height: clamp(16px, 2.4vw, 24px);
  background: rgba(6, 180, 139, 0.6);
  filter: blur(clamp(8px, 1.2vw, 12px));
  z-index: 2;
  transform: translate(-50%, -50%) scaleX(1.2);
}

.star-glow-3 {
  height: clamp(14px, 2.1vw, 21px);
  background: rgba(6, 180, 139, 0.4);
  filter: blur(clamp(12px, 1.8vw, 18px));
  z-index: 3;
  transform: translate(-50%, -50%) scaleX(1.8);
}

.star-glow-4 {
  height: clamp(12px, 1.8vw, 18px);
  background: rgba(6, 180, 139, 0.3);
  filter: blur(clamp(16px, 2.4vw, 24px));
  z-index: 4;
  transform: translate(-50%, -50%) scaleX(2.6);
}

.star-glow-5 {
  height: clamp(10px, 1.5vw, 15px);
  background: rgba(6, 180, 139, 0.2);
  filter: blur(clamp(20px, 3vw, 30px));
  z-index: 5;
  transform: translate(-50%, -50%) scaleX(3.4);
}

.bar-current {
  position: relative;
}

.bar-current:hover {
  background: linear-gradient(to top, #6fba67, #8fef84, #afffa3) !important;
  -webkit-transform: translate3d(0, -2px, 0);
  -moz-transform: translate3d(0, -2px, 0);
  -ms-transform: translate3d(0, -2px, 0);
  -o-transform: translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
  box-shadow: 0 4px 8px rgba(143, 254, 131, 0.3);
}

.bar-value {
  color: #ffffff;
  font-size: clamp(0.6rem, 1.1vw, 11px);
  font-weight: 600;
  text-shadow: clamp(0.5px, 0.1vw, 1px) clamp(0.5px, 0.1vw, 1px) clamp(1px, 0.2vw, 2px) rgba(0, 0, 0, 0.8);
}

.bar-empty {
  width: 35%;
  position: relative;
}

.bar-empty-current {
  min-height: 20px;
}

.labels-container {
  display: flex;
  justify-content: space-between;
  gap: clamp(0.5rem, 1.2vw, 12px);
  height: clamp(18px, 2.4vh, 24px);
  margin-top: clamp(0.5rem, 1vh, 10px);
  padding-top: clamp(0.4rem, 0.8vh, 8px);
  padding-left: clamp(1rem, 2vw, 20px); /* Match Y-axis width + gap */
  border-top: 2px solid rgba(143, 254, 131, 0.2);
}

.day-label {
  flex: 1;
  font-size: clamp(0.6rem, 1.1vw, 11px);
  color: #8ffe83;
  text-align: center;
  font-weight: 600;
  text-transform: capitalize;
}
</style>
