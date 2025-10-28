<template>
  <v-app>
    <v-main class="login-background d-flex justify-center align-center">
      <v-card class="login-card pa-6" max-width="400">
        <v-card-title class="text-h5 font-weight-bold text-center mb-2">Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitLogin">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-inner-icon="mdi-account"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              type="password"
              outlined
              dense
              class="mb-4"
              required
            />
            <v-card-actions class="mt-4 justify-center">
              <v-btn color="primary" type="submit" class="text-none elevation-2" large>Login</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const adminCredentials = {
  username: 'admin',
  password: 'admin123',
}

function submitLogin() {
  if (
    username.value === adminCredentials.username &&
    password.value === adminCredentials.password
  ) {
    const userData = { username: username.value, role: 'admin' }
    const token = 'fake-jwt-token'
    authStore.login(userData, token)
    router.push('/dashboard')
  } else {
    alert('Invalid username or password')
  }
}
</script>

<style scoped>
.login-background {
  height: 100vh;
  background: #f5f5f5;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.v-text-field input {
  font-size: 14px;
}

.v-btn {
  text-transform: none;
}
</style>
