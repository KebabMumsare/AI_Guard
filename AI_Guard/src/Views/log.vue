<script setup>
import { ref, onMounted } from 'vue';

const logs = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchLogs = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:3000/api/logs');
    if (!response.ok) throw new Error('Failed to fetch logs');
    const data = await response.json();
    logs.value = data.logs;
  } catch (err) {
    console.error('Error fetching logs:', err);
    error.value = 'Failed to load logs. Please ensure the backend is running.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

onMounted(() => {
  fetchLogs();
  setInterval(fetchLogs, 10000);
});
</script>

<template>
  <div class="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8">
    <h1 class="text-[#8ffe83] font-bold text-4xl sm:text-5xl md:text-6xl mb-6 sm:mb-8">Event Logs</h1>
    
    <div v-if="loading && logs.length === 0" class="text-[#8ffe83] text-xl animate-pulse">
      Loading logs...
    </div>
    
    <div v-else-if="error" class="text-red-500 text-xl bg-red-900/20 p-4 rounded-lg border border-red-500/50 w-full max-w-[95vw]">
      {{ error }}
    </div>
    
    <div v-else class="w-full max-w-[95vw] overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-full">
        <thead>
          <tr class="border-b-2 border-[#8ffe83]">
            <th class="p-3 sm:p-4 text-[#8ffe83] font-bold text-base sm:text-lg">Timestamp</th>
            <th class="p-3 sm:p-4 text-[#8ffe83] font-bold text-base sm:text-lg">Event Type</th>
            <th class="p-3 sm:p-4 text-[#8ffe83] font-bold text-base sm:text-lg">Description</th>
            <th class="p-3 sm:p-4 text-[#8ffe83] font-bold text-base sm:text-lg">Camera ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id" class="border-b border-[#8ffe83]/30 hover:bg-[#8ffe83]/10 transition-colors">
            <td class="p-3 sm:p-4 text-white text-sm sm:text-base">{{ formatDate(log.timestamp) }}</td>
            <td class="p-3 sm:p-4 text-[#8ffe83] font-medium text-sm sm:text-base">{{ log.event_type }}</td>
            <td class="p-3 sm:p-4 text-gray-300 text-sm sm:text-base">{{ log.description }}</td>
            <td class="p-3 sm:p-4 text-gray-400 text-xs sm:text-sm">{{ log.camera_id }}</td>
          </tr>
          <tr v-if="logs.length === 0">
            <td colspan="4" class="p-8 text-center text-gray-400 italic">No logs found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  height: 8px;
}
div::-webkit-scrollbar-track {
  background: #37393B;
}
div::-webkit-scrollbar-thumb {
  background: #5faa57;
  border-radius: 4px;
}
div::-webkit-scrollbar-thumb:hover {
  background: #8ffe83;
}
</style>