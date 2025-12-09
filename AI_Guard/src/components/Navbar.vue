<template>
  <nav class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-6xl">
    <div class="bg-graphite-black/95 backdrop-blur-md rounded-full px-10 py-4 shadow-2xl shadow-black/50 border border-lime-500/30 flex items-center gap-12">
      <!-- Logo -->
      <div class="flex items-center">
        <span class="text-2xl font-bold text-white tracking-wide">AI-Guard</span>
      </div>

      <!-- Links -->
      <ul class="flex items-center gap-8 m-0 p-0 list-none">
        <li>
          <router-link 
            to="/home" 
            class="nav-link"
          >
            Home
          </router-link>
        </li>
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

</script>

<style scoped>
.nav-link {
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  padding-bottom: 4px;
  transition: color 0.2s ease, border-bottom-color 0.2s ease;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #8ffe83;
}

.nav-link.router-link-active {
  color: #8ffe83;
  border-bottom-color: #8ffe83;
}
</style>
