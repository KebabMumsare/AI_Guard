<script setup>
import { ref } from 'vue'
import BlockGraph from '../components/BlockGraph.vue'
import mockData from '../data/mockData.json'

const events = ref(Array.isArray(mockData) ? mockData : [])
</script>

<template>
  <div class="graph-page">
    <h1 class="graph-title">Event Graph</h1>
    
    <div class="graphs-container">
      <BlockGraph :events="events" mode="filtered" />
      <BlockGraph :events="events" mode="highscores" />
    </div>
  </div>
</template>

<style scoped>
.graph-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 2vw 2vh;
  box-sizing: border-box;
  overflow: auto;
}

.graph-title {
  color: #8ffe83;
  font-weight: bold;
  font-size: clamp(2rem, 8vw, 6rem);
  margin-bottom: 3vh;
  text-align: center;
}

.graphs-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 2vh 2vw;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
}

.graphs-container > * {
  flex: 0 0 auto;
}

@media (max-width: 1080px) {
  .graphs-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .graphs-container > * {
    flex: 1 1 100%;
    width: 100%;
  }
}
</style>