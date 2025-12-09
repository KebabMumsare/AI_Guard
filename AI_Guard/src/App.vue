<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div id="app" >
    <Navbar />
    <router-view />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #37393B;
}
body {
  @apply bg-neutral-900;
}
</style>
