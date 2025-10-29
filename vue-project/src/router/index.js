import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/components/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  {
    path: '/edit/:id',
    name: 'PublicEdit',
    component: () => import('@/pages/Publicedit.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' }
  }

  if (authStore.isAuthenticated && to.name === 'Login') {
    return { name: 'Dashboard' }
  }

  return true
})
export default router
