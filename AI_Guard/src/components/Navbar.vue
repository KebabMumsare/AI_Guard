<template>
  <nav class="navbar">
    <router-link to="/admin" class="nav-link">Admin</router-link>
    <span class="separator">|</span>
    <router-link to="/graph" class="nav-link">Graph</router-link>
    <span class="separator">|</span>
    <router-link to="/home" class="nav-link">Home</router-link>
    <span class="separator">|</span>
    <router-link to="/live" class="nav-link">Live</router-link>
    <span class="separator">|</span>
    <router-link to="/log" class="nav-link">Log</router-link>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  padding: 6px 10px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px 8px;
}

.nav-link {
  margin: 0;
  padding: 4px 8px;
  text-decoration: none;
  color: #8ffe83;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #7ae570;
}

.nav-link.router-link-active {
  color: #5faa57;
}

.separator {
  color: #8ffe83;
  font-size: 14px;
  opacity: 0.6;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .navbar {
    padding: 10px 15px;
    gap: 6px 12px;
  }
  
  .nav-link {
    font-size: 16px;
    padding: 6px 12px;
  }
  
  .separator {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .navbar {
    padding: 20px;
    gap: 8px 16px;
  }
  
  .nav-link {
    font-size: 18px;
    margin: 0 10px;
  }
  
  .separator {
    font-size: 18px;
  }
}
</style>
