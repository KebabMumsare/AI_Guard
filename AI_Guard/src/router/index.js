import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../Views/admin.vue'
import Graph from '../Views/graph.vue'
import Live from '../Views/live.vue'
import Log from '../Views/log.vue'
import Home from '../Views/home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/graph',
    name: 'Graph',
    component: Graph
  },
  {
    path: '/live',
    name: 'Live',
    component: Live
  },
  {
    path: '/log',
    name: 'Log',
    component: Log
  },
  {
    path: '/home',
    name: 'HomePage',
    component: Home
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
