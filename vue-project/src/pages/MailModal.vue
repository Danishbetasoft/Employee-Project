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
              label="CC (optional)"
              variant="outlined"
              prepend-inner-icon="mdi-email-outline"
            />
            <v-text-field
              v-model="mailFormData.bcc"
              label="BCC (optional)"
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
          <v-btn color="primary" class="text-none elevation-2" @click="sendMail" :loading="loading">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { apiemployee } from '@/plugins/employee'
  
  const props = defineProps({ 
    employee: Object,
    visible: Boolean,
    mailFormData: Object, 
  })
  const emit = defineEmits(['close', 'send'])
  
  const loading = ref(false)
  
  async function sendMail() {
    if (!props.mailFormData.to || !props.mailFormData.companyName) {
      alert('Please fill in required fields: To and Company Name')
      return
    }
  
    loading.value = true
  
    try {
      const payload = {
        user_id: props.employee.id,
        to: props.mailFormData.to.split(',').map(e => e.trim()).filter(e => e),
        cc: props.mailFormData.cc ? props.mailFormData.cc.split(',').map(e => e.trim()).filter(e => e) : [],
        bcc: props.mailFormData.bcc ? props.mailFormData.bcc.split(',').map(e => e.trim()).filter(e => e) : [],
        companyName: props.mailFormData.companyName,
        message: props.mailFormData.message || '',
      }
  
      const response = await apiemployee.sendMail(payload)
      console.log('Mail sent successfully:', response.data)
      alert('Mail sent successfully!')
      
      emit('send', payload)
      emit('close')
    } catch (err) {
      console.error('Error sending mail:', err)
      alert('Failed to send mail. Check console for details.')
    } finally {
      loading.value = false
    }
  }
  </script>
  