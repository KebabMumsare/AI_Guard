<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white font-sans">
    <Navbar />
    <main class="pt-24 px-8 max-w-7xl mx-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* Global styles if needed, but Tailwind handles most */
body {
  @apply bg-neutral-900;
}
</style>
