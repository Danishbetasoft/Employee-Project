<template>
    <v-dialog 
      :model-value="visible" 
      @update:model-value="$emit('close')" 
      max-width="900" 
      transition="dialog-bottom-transition" 
      persistent
    >
      <v-card class="rounded-xl">
        <v-toolbar color="primary" flat class="rounded-t-xl">
          <v-toolbar-title class="text-white text-h6 font-weight-regular">
            Professional Background - {{ employee.username || 'New Employee' }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text class="pa-6" style="max-height: 70vh; overflow-y: auto">
          <v-form>
            <v-sheet class="pa-4 mb-4" elevation="1" rounded>
              <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Employee Identification</h3>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employee.bgInfo.name" label="Employee Name" prepend-inner-icon="mdi-badge-account-outline" variant="outlined" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employee.bgInfo.id" label="Employee ID" prepend-inner-icon="mdi-identifier" variant="outlined" />
                </v-col>
              </v-row>
            </v-sheet>
  
            <v-sheet class="pa-4 mb-4" elevation="1" rounded>
              <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Employment Details</h3>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employee.bgInfo.prevCompany" label="Previous Company" variant="outlined" prepend-inner-icon="mdi-office-building" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employee.bgInfo.designation" label="Designation" variant="outlined" prepend-inner-icon="mdi-briefcase-outline" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employee.bgInfo.salary" label="Salary" variant="outlined" prepend-inner-icon="mdi-cash" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employee.bgInfo.increment" label="Increment" variant="outlined" prepend-inner-icon="mdi-trending-up" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employee.bgInfo.startDate" label="Start Date" type="date" variant="outlined" prepend-inner-icon="mdi-calendar-start" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="employee.bgInfo.endDate" label="End Date" type="date" variant="outlined" prepend-inner-icon="mdi-calendar-end" />
                </v-col>
              </v-row>
            </v-sheet>
  
            <v-sheet class="pa-4 mb-4" elevation="1" rounded>
              <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Performance & Conduct</h3>
              <v-row dense>
                <v-col cols="12">
                  <v-textarea v-model="employee.bgInfo.responsibilities" label="Responsibilities" rows="3" variant="outlined" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="employee.bgInfo.reasonLeaving" label="Reason for Leaving" rows="2" variant="outlined" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="employee.bgInfo.conduct" label="Conduct" rows="2" variant="outlined" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="employee.bgInfo.additionalRemarks" label="Additional Remarks" rows="2" variant="outlined" />
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="employee.bgInfo.reference" label="Reference" variant="outlined" prepend-inner-icon="mdi-account-tie-outline" />
                </v-col>
              </v-row>
            </v-sheet>
  
            <v-card-actions class="px-0 pt-4">
              <v-spacer />
              <v-btn variant="text" @click="$emit('close')" class="text-none">Cancel</v-btn>
              <v-btn color="primary" class="text-none elevation-2" @click="$emit('save', employee.bgInfo)">
                Save Professional Background
              </v-btn>
              <v-btn color="secondary" class="rounded-lg" @click="$emit('copy')">Copy Link</v-btn>
              <v-btn color="success" class="rounded-lg" @click="$emit('mail')">Send Mail</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  defineProps({
    employee: Object,
    visible: Boolean,
  })
  defineEmits(['save', 'close', 'copy', 'mail'])
  </script>