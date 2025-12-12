import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../Views/admin.vue'
import Statistics from '../Views/Statistics.vue'
import Live from '../Views/live.vue'
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
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
  {
    path: '/live',
    name: 'Live',
    component: Live
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
