<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { login } = useAuth()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  const result = await login(username.value, password.value)
  
  if (result.success) {
    router.push('/admin')
  } else {
    error.value = result.error || 'Invalid credentials'
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[80vh] px-4">
    <div class="w-full max-w-md p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-[#8ffe83]/30 shadow-[0_0_50px_rgba(143,254,131,0.1)] animate-fade-in">
      <h2 class="text-3xl font-bold text-[#8ffe83] mb-2 text-center tracking-wider">ACCESS CONTROL</h2>
      <p class="text-[#8ffe83]/70 text-center mb-8 text-sm">Please identify yourself to proceed</p>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label for="username" class="block text-xs font-medium text-[#8ffe83] uppercase tracking-widest">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="w-full px-4 py-3 bg-black/50 border border-[#8ffe83]/30 rounded-lg focus:outline-none focus:border-[#8ffe83] focus:ring-1 focus:ring-[#8ffe83] text-white placeholder-gray-500 transition-all duration-300 hover:border-[#8ffe83]/60"
            placeholder="Enter username"
          />
        </div>
        
        <div class="space-y-2">
          <label for="password" class="block text-xs font-medium text-[#8ffe83] uppercase tracking-widest">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-4 py-3 bg-black/50 border border-[#8ffe83]/30 rounded-lg focus:outline-none focus:border-[#8ffe83] focus:ring-1 focus:ring-[#8ffe83] text-white placeholder-gray-500 transition-all duration-300 hover:border-[#8ffe83]/60"
            placeholder="Enter password"
          />
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded border border-red-500/30">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 px-4 bg-[#8ffe83]/10 hover:bg-[#8ffe83]/20 border border-[#8ffe83] text-[#8ffe83] font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(143,254,131,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center justify-center gap-2 group"
        >
          <span v-if="!isLoading">Authenticate</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
