<script setup>
</script>

<template>
  <div id="app" >
    <nav>
      <router-link to="/admin">Admin</router-link> |
      <router-link to="/graph">Graph</router-link> |
      <router-link to="/live">Live</router-link> |
      <router-link to="/log">Log</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
nav {
  padding: 20px;
  text-align: center;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #42b983;
  font-weight: bold;
}

nav a.router-link-active {
  color: #35495e;
}
#app {
  min-height: 100vh;
  background-color: #37393B;
}
</style>
