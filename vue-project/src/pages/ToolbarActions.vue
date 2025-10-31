<template>
    <v-row class="mb-6 align-center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold text-primary mb-1">{{ title }}</h1>
        <p class="text-subtitle-1 text-medium-emphasis">{{ subtitle }}</p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end align-center gap-3">
        <v-btn color="error" large @click="$emit('logout')">
          <v-icon start>mdi-logout</v-icon>
          Logout
        </v-btn>
        <v-btn color="primary" large @click="$emit('add')">
          <v-icon start>mdi-account-plus</v-icon>
          Add New Employee
        </v-btn>
      </v-col>
    </v-row>
  </template>
  
  <script setup>
  defineProps({
    title: { type: String, default: 'Employee Directory' },
    subtitle: { type: String, default: 'Manage all personnel data efficiently' },
  })
  defineEmits(['add', 'logout'])
  </script>
  
  <style scoped>
  .v-btn {
    border-radius: 8px;
  }
  </style>
  