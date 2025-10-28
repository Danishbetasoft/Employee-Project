<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Update Professional Background</h1>
        <v-form ref="bgForm" v-model="formValid">
          <v-sheet class="pa-4 mb-4" elevation="1" rounded>
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">
              Employee Identification
            </h3>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="bgInfo.name"
                  label="Employee Name"
                  :readonly="!!adminPrefill.name"
                  prepend-inner-icon="mdi-badge-account-outline"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="bgInfo.id"
                  label="Employee ID"
                  :readonly="!!adminPrefill.id"
                  prepend-inner-icon="mdi-identifier"
               
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-sheet>

          <v-sheet class="pa-4 mb-4" elevation="1" rounded>
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">
              Previous Employment Details
            </h3>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="bgInfo.prevCompany"
                  label="Previous Company"
                  :readonly="!!adminPrefill.prevCompany"
                  prepend-inner-icon="mdi-domain"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  v-model="startMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :model-value="formatDate(bgInfo.startDate)"
                      label="Start Date"
                      readonly
                      prepend-inner-icon="mdi-calendar-start"
                      variant="outlined"
                    />
                  </template>
                  <v-date-picker
                    v-model="bgInfo.startDate"
                    @update:model-value="startMenu = false"
                    color="primary"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  v-model="endMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      :model-value="formatDate(bgInfo.endDate)"
                      label="End Date"
                      readonly
                      prepend-inner-icon="mdi-calendar-end"
                      variant="outlined"
                    />
                  </template>
                  <v-date-picker
                    v-model="bgInfo.endDate"
                    @update:model-value="endMenu = false"
                    color="primary"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="bgInfo.designation"
                  label="Designation"
                  :readonly="!!adminPrefill.designation"
                  prepend-inner-icon="mdi-account-tie"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-sheet>

          <v-sheet class="pa-4 mb-4" elevation="1" rounded>
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">
              Financial Information
            </h3>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="bgInfo.salary"
                  label="Salary Withdrawn"
                  prepend-inner-icon="mdi-currency-usd"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="bgInfo.increment"
                  label="Last Increment"
                  prepend-inner-icon="mdi-trending-up"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-sheet>

          <v-sheet class="pa-4 mb-4" elevation="1" rounded>
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Narrative Details</h3>
            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  v-model="bgInfo.responsibilities"
                  label="Key Responsibilities"
                  variant="outlined"
                  rows="3"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="bgInfo.reasonLeaving"
                  label="Reason for Leaving"
                  variant="outlined"
                  rows="3"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="bgInfo.conduct"
                  label="Conduct & Performance"
                  variant="outlined"
                  rows="3"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="bgInfo.reference"
                  label="Reference Contact"
                  prepend-inner-icon="mdi-phone-in-talk-outline"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="bgInfo.additionalRemarks"
                  label="Additional Remarks"
                  prepend-inner-icon="mdi-note-text-outline"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-sheet>

          <v-card-actions class="px-0 pt-4">
            <v-spacer />
            <v-btn color="primary" class="text-none elevation-2" @click="saveBgInfo">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { employeeStore } from '@/stores/employee'

const route = useRoute()
const store = employeeStore()

const bgInfo = reactive({})
const adminPrefill = reactive({})
const startMenu = ref(false)
const endMenu = ref(false)
const formValid = ref(false)

function formatDate(dateValue) {
  if (!dateValue) return ''
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
  return date.toISOString().substring(0, 10)
}

onMounted(() => {
  const id = parseInt(route.params.id)
  const employee = store.getUser(id)

  if (employee) {
    for (const key in employee.bgInfo) {
      bgInfo[key] = employee.bgInfo[key] || ''
      if (employee.bgInfo[key]) adminPrefill[key] = true
    }
  }
})

function saveBgInfo() {
  const id = parseInt(route.params.id)
  store.updateUser(id, { bgInfo: { ...bgInfo } })
  alert('Background info saved successfully!')
}
</script>
<style scoped>
.v-input__prepend-inner .v-icon {
  font-size: 18px !important; 
}
</style>