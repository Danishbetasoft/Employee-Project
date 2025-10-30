import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/components/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import ThankYou from '@/pages/ThankYou.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/thankyou', name: 'Thank', component: ThankYou },
  {
    path: '/edit/:id',
    name: 'PublicEdit',
    component: () => import('@/pages/Publicedit.vue'),
    meta: { public: true }, // <-- mark as public
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await new Promise(resolve => setTimeout(resolve, 0))

  if (to.meta.public) {
    return true
  }

  if (!authStore.isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' }
  }

  if (authStore.isAuthenticated && to.name === 'Login') {
    return { name: 'Dashboard' }
  }

  return true
})


export default router
