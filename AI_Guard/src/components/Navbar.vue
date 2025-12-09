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
  position: sticky;
  top: 0;
  z-index: 1000;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #8ffe83;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  padding-bottom: 5px;
  border-bottom: 2px solid transparent;
}

nav a.router-link-active {
  color: #8ffe83;
  border-bottom-color: #8ffe83;
}
</style>
