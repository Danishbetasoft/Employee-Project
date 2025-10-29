import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vueitfy from './plugins/vueitfy'
import 'devextreme/dist/css/dx.light.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuthStore } from './stores/auth'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vueitfy)
const authStore = useAuthStore()
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !authStore.isAuthenticated) return next('/login')
  if (to.path === '/login' && authStore.isAuthenticated) return next('/dashboard')
  next()
})

app.mount('#app')
