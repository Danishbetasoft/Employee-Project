<template>
    <v-dialog 
      :model-value="visible" 
      @update:model-value="$emit('close')" 
      max-width="600" 
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card class="rounded-xl">
        <v-toolbar color="primary" flat class="rounded-t-xl">
          <v-toolbar-title class="text-white text-h6 font-weight-regular">
            Send Mail - {{ employee.username || 'Employee' }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="$emit('close')"> 
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text class="pa-6">
          <v-form ref="mailForm" @submit.prevent="sendMail">
            <v-text-field
              v-model="mailFormData.to"
              label="To (comma separated emails)"
              variant="outlined"
              prepend-inner-icon="mdi-email-multiple-outline"
              required
            />
            <v-text-field
              v-model="mailFormData.cc"
              label="CC"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
            />
            <v-text-field
              v-model="mailFormData.bcc"
              label="BCC"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
            />
            <v-text-field
              v-model="mailFormData.companyName"
              label="Company Name"
              variant="outlined"
              prepend-inner-icon="mdi-office-building"
              required
            />
            <v-textarea
              v-model="mailFormData.message"
              label="Message (optional)"
              rows="3"
              variant="outlined"
              prepend-inner-icon="mdi-text"
            />
          </v-form>
        </v-card-text>
  
        <v-card-actions class="px-6 pb-4">
          <v-spacer />
          <v-btn variant="text" @click="$emit('close')" class="text-none">Cancel</v-btn>
          <v-btn color="primary" class="text-none elevation-2" @click="sendMail">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  const props = defineProps({ 
    employee: Object,
    visible: Boolean,
    mailFormData: Object, 
  })
  const emit = defineEmits(['close', 'send'])
  
  function sendMail() {
    console.log('Attempting to send mail with data:', props.mailFormData);
    emit('close'); 
  }
  </script>