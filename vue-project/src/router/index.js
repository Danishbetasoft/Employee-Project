import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/components/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  {
    path: '/edit/:id',
    name: 'PublicEdit',
    component: () => import('@/pages/Publicedit.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.path !== '/login' && !authStore.isAuthenticated) return '/login'
  if (to.path === '/login' && authStore.isAuthenticated) return '/dashboard'
})

export default router
