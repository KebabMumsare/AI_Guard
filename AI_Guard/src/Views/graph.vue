<script setup>
import { ref, computed, onMounted } from 'vue'
import BlockGraph from '../components/BlockGraph.vue'
import mockData from '../data/mockData.json'

const events = ref(Array.isArray(mockData) ? mockData : [])

const processEventData = (eventName) => {
  const filteredEvents = events.value.filter(e => e.eventName === eventName)
  
  const groupedByDate = {}
  filteredEvents.forEach(event => {
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
  
  const allDates = Object.keys(groupedByDate).sort()
  const mostRecentDate = allDates.length > 0 ? new Date(allDates[allDates.length - 1]) : new Date()
  
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(mostRecentDate)
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    
    last7Days.push({
      date: dateKey,
      count: groupedByDate[dateKey]?.count || 0
    })
  }
  
  return last7Days
}

const xxxData = computed(() => processEventData('XXX'))
const yyyData = computed(() => processEventData('YYY'))
const zzzData = computed(() => processEventData('ZZZ'))
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-8">
    <h1 class="text-[#8ffe83] font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8">Event Graph</h1>
    
    <div class="w-full max-w-7xl flex flex-col gap-6">
      <BlockGraph 
        title="XXX Events" 
        :data="xxxData" 
      />
      <BlockGraph 
        title="YYY Events" 
        :data="yyyData" 
      />
      <BlockGraph 
        title="ZZZ Events" 
        :data="zzzData" 
      />
    </div>
  </div>
</template>

<style scoped>

</style>