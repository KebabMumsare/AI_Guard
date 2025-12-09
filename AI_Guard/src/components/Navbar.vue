<template>
  <nav>
    <router-link to="/admin">Admin</router-link> |
    <router-link to="/graph">Graph</router-link> |
    <router-link to="/home">Home</router-link> |
    <router-link to="/live">Live</router-link> |
    <router-link to="/log">Log</router-link> |
  </nav>
</template>

<script setup>
</script>

<style scoped>
nav {
  padding: 20px;
  text-align: center;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #8ffe83;
  font-weight: bold;
}

nav a.router-link-active {
  color: #5faa57;
}
</style>
