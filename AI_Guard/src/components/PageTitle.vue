<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <h1 class="page-title">{{ title }}</h1>
</template>

<style scoped>
.page-title {
  color: #8ffe83;
  font-weight: bold;
  font-size: 3rem;
  margin-bottom: 3vh;
  text-align: center;
}

@media (min-width: 640px) {
  .page-title {
    font-size: 4rem;
  }
}

@media (min-width: 1024px) {
  .page-title {
    font-size: 5rem;
  }
}
</style>

