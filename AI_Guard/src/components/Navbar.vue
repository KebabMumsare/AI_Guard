<template>
  <nav class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-6xl">
    <div class="bg-graphite-black/90 backdrop-blur-md rounded-full px-10 py-4 shadow-lg border border-white/10 flex items-center gap-12">
      <!-- Logo -->
      <div class="flex items-center">
        <span class="text-2xl font-bold text-white tracking-wide">AI_Guard</span>
      </div>

      <!-- Links -->
      <ul class="flex items-center gap-8 m-0 p-0 list-none">
        <li>
          <router-link 
            to="/graph" 
            class="nav-link"
          >
            Graph
          </router-link>
        </li>
        <li>
          <router-link 
            to="/live" 
            class="nav-link"
          >
            Live
          </router-link>
        </li>
        <li>
          <router-link 
            to="/log" 
            class="nav-link"
          >
            Log
          </router-link>
        </li>
        <li>
          <router-link 
            to="/admin" 
            class="nav-link"
          >
            Admin
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
// No script logic needed for basic navbar currently
</script>

<style scoped>
.nav-link {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  padding-bottom: 4px;
  transition: color 0.2s ease, border-bottom-color 0.2s ease;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #8ffe83; /* neon-green */
}

.nav-link.router-link-active {
  color: #8ffe83; /* neon-green */
  border-bottom-color: #8ffe83;
}
</style>
