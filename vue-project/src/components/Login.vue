<template>
  <v-container fluid class="login-background d-flex align-center justify-center">
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card class="login-card pa-6 elevation-12">
          <div class="text-center mb-6">
            <h2 class="login-title mb-1">Welcome Back</h2>
            <p class="login-subtitle">Sign in to your account</p>
          </div>

          <v-form ref="loginForm" v-model="formValid">
            <v-text-field
              v-model="username"
              label="Username"
              placeholder="Enter your username"
              prepend-inner-icon="mdi-account-circle-outline"
              rounded
              dense
              outlined
              required
            />
            <v-text-field
              v-model="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              prepend-inner-icon="mdi-lock-outline"
              rounded
              dense
              outlined
              required
              class="mt-4"
            />
            <v-btn
              color="primary"
              class="mt-6 w-100 login-btn"
              :disabled="!formValid"
              @click="submitLogin"
            >
              Login
            </v-btn>
          </v-form>

          <v-alert
            v-if="errorMsg"
            type="error"
            dense
            outlined
            class="mt-4"
          >
            {{ errorMsg }}
          </v-alert>

         
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const formValid = ref(false)
const errorMsg = ref('')

const router = useRouter()
const authStore = useAuthStore()
import { nextTick } from 'vue'

onMounted(() => {
  nextTick(() => {
    if (authStore.isAuthenticated) {
      router.push('/dashboard')
    }
  })
})


async function submitLogin() {
  errorMsg.value = ''
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/dashboard')
  } else {
    errorMsg.value = 'Invalid credentials'
  }
}
</script>

<style scoped>
.login-background {
  height: 100vh;
  background: linear-gradient(135deg, #e0eaff, #f5f5f7);
}

.login-card {
  border-radius: 24px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
}
.login-card:hover {
  transform: translateY(-4px);
}

.login-title {
  font-weight: 700;
  font-size: 24px;
  color: #1e1e2f;
}

.login-subtitle {
  font-weight: 400;
  font-size: 14px;
  color: #6b6b7d;
}

.v-text-field input {
  font-size: 14px;
  color: #1e1e2f;
}

.login-btn {
  font-weight: 600;
  font-size: 15px;
  border-radius: 12px;
  transition: transform 0.2s ease;
}
.login-btn:hover {
  transform: scale(1.02);
}
</style>
