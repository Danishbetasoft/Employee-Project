<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4">
          <h2 class="text-center mb-4">Login</h2>
          <v-form ref="loginForm" v-model="formValid">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-inner-icon="mdi-account"
              required
            />
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              prepend-inner-icon="mdi-lock"
              required
            />
            <v-btn
              color="primary"
              class="mt-4"
              :disabled="!formValid"
              @click="submitLogin"
            >
              Login
            </v-btn>
          </v-form>
          <v-alert v-if="errorMsg" type="error" dense class="mt-3">{{ errorMsg }}</v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const formValid = ref(false)
const errorMsg = ref('')

const router = useRouter()
const authStore = useAuthStore()

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
.login-background { height: 100vh; background: #f5f5f5; }
.login-card { border-radius: 16px; box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.1); width: 100%; }
.v-text-field input { font-size: 14px; }
.v-btn { text-transform: none; }
</style>
