import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../Views/admin.vue'
import Statistics from '../Views/statistics.vue'
import Live from '../Views/live.vue'
import Home from '../Views/home.vue'
import Login from '../Views/Login.vue'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuth()

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn.value) {
    next('/admin')
  } else {
    next()
  }
})

export default router
