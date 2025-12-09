<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  }
})

const maxValue = computed(() => {
  if (props.data.length === 0) return 1
  return Math.max(...props.data.map(d => d.count), 1)
})

const getDayLabel = (date) => {
  const day = new Date(date)
  const year = day.getFullYear() % 100 //Last 2 digits of year
  const month = day.getMonth() + 1
  const dayNumber = day.getDate()
  
  return `${year}/${month}/${dayNumber}`
}
</script>

<template>
  <div class="block-graph">
    <h3 class="graph-title">{{ title }}</h3>
    <div class="blocks-container">
      <div 
        v-for="(day, index) in data" 
        :key="index" 
        class="block-wrapper"
      >
        <div 
          v-if="day.count > 0"
          class="block" 
          :style="{ 
            height: maxValue > 0 ? `${(day.count / maxValue) * 100}%` : '0%'
          }"
          :title="`${day.count} on ${getDayLabel(day.date)}`"
        >
          <span class="block-value">{{ day.count }}</span>
        </div>
        <div v-else class="block-empty"></div>
        <div class="block-label">{{ getDayLabel(day.date) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.block-graph {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.graph-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #8ffe83;
}

.blocks-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  flex: 1;
  min-height: 200px;
  height: 200px;
}

.block-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 4px;
  height: 200px;
  justify-content: flex-end;
}

.block {
  width: 75%;
  background: linear-gradient(to top, #5faa57, #8ffe83);
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 0;
}

.block:hover {
  background: linear-gradient(to top, #6fba67, #9fff93);
  transform: translateY(-2px);
}

.block-value {
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
}

.block-empty {
  width: 100%;
  height: 100%;
}

.block-label {
  font-size: 11px;
  color: #5faa57;
  text-align: center;
}
</style>

