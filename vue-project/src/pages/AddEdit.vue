<template>
  <v-dialog 
    :model-value="visible" 
    @update:model-value="$emit('close')" 
    max-width="600" 
    transition="dialog-bottom-transition" 
    persistent
  >
    <v-card class="rounded-xl elevation-8 modern-card">
      <v-toolbar flat class="modern-toolbar">
        <v-toolbar-title class="text-white text-h6 font-weight-medium">
          {{ isEditing ? 'Edit Employee' : 'Add New Employee' }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon variant="text" @click="$emit('close')">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-6">
        <Form :validation-schema="schema" :initial-values="employee" @submit="saveInfo">
          <v-row dense>
            <v-col cols="12">
              <Field name="username" v-slot="{ field, errors }">
                <v-text-field
                  v-bind="field"
                  label="Username"
                  variant="outlined"
                  prepend-inner-icon="mdi-account-circle-outline"
                  color="primary"
                  class="rounded-lg"
                  :error="errors.length > 0"
                  :error-messages="errors"
                  v-model="employee.username"
                />
              </Field>
            </v-col>

            <v-col cols="12">
              <Field name="email" v-slot="{ field, errors }">
                <v-text-field
                  v-bind="field"
                  label="Email"
                  variant="outlined"
                  prepend-inner-icon="mdi-email-outline"
                  color="primary"
                  class="rounded-lg"
                  type="email"
                  :error="errors.length > 0"
                  :error-messages="errors"
                  v-model="employee.email"
                />
              </Field>
            </v-col>
            <v-col cols="12">
              <Field name="password" v-slot="{ field, errors }">
                <v-text-field
                  v-bind="field"
                  label="Password"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock-outline"
                  color="primary"
                  class="rounded-lg"
                  type="password"
                  :error="errors.length > 0"
                  :error-messages="errors"
                  v-model="employee.password"
                />
              </Field>
            </v-col>
          </v-row>

          <div class="text-end mt-6">
            <v-btn variant="tonal" color="grey" class="text-none mr-3 rounded-lg" @click="$emit('close')">
              <v-icon start>mdi-cancel</v-icon> Cancel
            </v-btn>
            <v-btn color="primary" class="text-none elevation-2 rounded-lg" type="submit">
              <v-icon start>mdi-content-save-outline</v-icon>
              {{ isEditing ? 'Save Changes' : 'Add Employee' }}
            </v-btn>
          </div>
        </Form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps({
  employee: Object,
  isEditing: Boolean,
  visible: Boolean,
})

const emit = defineEmits(['save', 'close'])

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
})

function saveInfo(values) {
  emit('save', values) 
}
</script>