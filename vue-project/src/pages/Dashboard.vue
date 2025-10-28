<template>  <v-app>
    <v-main class="bg-grey-lighten-5">
      <v-container fluid class="py-10 px-6 mx-auto" style="max-width: 1200px">
        <v-row class="mb-6 align-center">
          <v-col cols="12" md="6">
            <h1 class="text-h4 font-weight-bold text-primary mb-1">Employee Directory</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Manage all personnel data efficiently
            </p>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end align-center gap-3">
            <v-btn
              color="error"
              class="text-none font-weight-medium elevation-3"
              large
              @click="handleLogout"
            >
              <v-icon start>mdi-logout</v-icon>
              Logout
            </v-btn>
            <v-btn
              color="primary"
              class="text-none font-weight-medium elevation-3"
              large
              @click="addEmployee"
            >
              <v-icon start>mdi-account-plus</v-icon>
              Add New Employee
            </v-btn>
          </v-col>
        </v-row>

        <v-card class="rounded-lg elevation-6">
          <v-card-title class="pa-4 bg-grey-lighten-3">
            <v-text-field
              v-model="search"
              label="Search Employees"
              prepend-inner-icon="mdi-magnify"
            
              variant="solo-filled"
              density="compact"
              hide-details
            />
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="employeesForTable"
            item-key="id"
            :search="search"
          >
          <template #item.actions="{ item }">
  <div class="action-buttons">
    <v-btn icon color="primary" size="small" @click.stop="editEmployee(item)">
      <v-icon size="18">mdi-pencil-outline</v-icon>
    </v-btn>
    <v-btn icon color="secondary" size="small" @click.stop="openBgInfo(item)">
      <v-icon size="18">mdi-file-document-outline</v-icon>
    </v-btn>
    <v-btn icon color="red-darken-2" size="small" @click.stop="deleteEmployee(item)">
      <v-icon size="18">mdi-delete-outline</v-icon>
    </v-btn>
  </div>
</template>


            <template #item.username="{ item }">
              <span
                class="font-weight-medium text-primary cursor-pointer"
                @click="editEmployee(item)"
              >
                {{ item.username }}
              </span>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="modalVisible" max-width="700" transition="dialog-bottom-transition">
          <v-card class="rounded-xl">
            <v-toolbar color="primary" flat class="rounded-t-xl">
              <v-toolbar-title class="text-white text-h6 font-weight-regular">
                {{ isEditing ? `Editing: ${selectedEmployee.username}` : 'Add New Employee' }}
              </v-toolbar-title>
              <v-spacer />
              <v-btn icon dark @click="modalVisible = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar>

            <v-card-text class="pa-6">
              <Form
                :validation-schema="schema"
                :initial-values="selectedEmployee"
                @submit="saveInfo"
              >
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <Field name="username" v-slot="{ field, errors }">
                      <v-text-field
                        v-bind="field"
                        label="Username"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-account"
                        :error="errors.length > 0"
                        :error-messages="errors"
                      />
                    </Field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <Field name="email" v-slot="{ field, errors }">
                      <v-text-field
                        v-bind="field"
                        label="Email"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-email-outline"
                        type="email"
                        :error="errors.length > 0"
                        :error-messages="errors"
                      />
                    </Field>
                  </v-col>
                </v-row>

                <v-card-actions class="px-0 pt-4">
                  <v-spacer />
                  <v-btn variant="text" @click="modalVisible = false" class="text-none"
                    >Cancel</v-btn
                  >
                  <v-btn color="primary" class="text-none elevation-2" type="submit"
                    >Save Changes</v-btn
                  >
                </v-card-actions>
              </Form>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog v-model="bgModalVisible" max-width="900" transition="dialog-bottom-transition">
          <v-card class="rounded-xl">
            <v-toolbar color="primary" flat class="rounded-t-xl">
              <v-toolbar-title class="text-white text-h6 font-weight-regular">
                Professional Background - {{ selectedEmployee.username || 'New Employee' }}
              </v-toolbar-title>
              <v-spacer />
              <v-btn icon dark @click="bgModalVisible = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar>

            <v-card-text class="pa-6" style="max-height: 70vh; overflow-y: auto">
              <v-form>
                <v-sheet class="pa-4 mb-4" elevation="1" rounded>
                  <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">
                    Employee Identification
                  </h3>
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="selectedEmployee.bgInfo.name"
                        label="Employee Name"
                        prepend-inner-icon="mdi-badge-account-outline"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="selectedEmployee.bgInfo.id"
                        label="Employee ID"
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
                        v-model="selectedEmployee.bgInfo.prevCompany"
                        label="Previous Company"
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
                            :model-value="formatDate(selectedEmployee.bgInfo.startDate)"
                            label="Start Date"
                            prepend-inner-icon="mdi-calendar-start"
                            readonly
                            variant="outlined"
                          />
                        </template>
                        <v-date-picker
                          v-model="selectedEmployee.bgInfo.startDate"
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
                            :model-value="formatDate(selectedEmployee.bgInfo.endDate)"
                            label="End Date"
                            prepend-inner-icon="mdi-calendar-end"
                            readonly
                            variant="outlined"
                          />
                        </template>
                        <v-date-picker
                          v-model="selectedEmployee.bgInfo.endDate"
                          @update:model-value="endMenu = false"
                          color="primary"
                        />
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="selectedEmployee.bgInfo.designation"
                        label="Designation"
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
                        v-model="selectedEmployee.bgInfo.salary"
                        label="Salary Withdrawn"
                        prepend-inner-icon="mdi-currency-usd"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="selectedEmployee.bgInfo.increment"
                        label="Last Increment"
                        prepend-inner-icon="mdi-trending-up"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-sheet>

                <v-sheet class="pa-4 mb-4" elevation="1" rounded>
                  <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">
                    Narrative Details
                  </h3>
                  <v-row dense>
                    <v-col cols="12">
                      <v-textarea
                        v-model="selectedEmployee.bgInfo.responsibilities"
                        label="Key Responsibilities"
                        variant="outlined"
                        rows="3"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="selectedEmployee.bgInfo.reasonLeaving"
                        label="Reason for Leaving"
                        variant="outlined"
                        rows="3"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="selectedEmployee.bgInfo.conduct"
                        label="Conduct & Performance"
                        variant="outlined"
                        rows="3"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="selectedEmployee.bgInfo.reference"
                        label="Reference Contact"
                        prepend-inner-icon="mdi-phone-in-talk-outline"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="selectedEmployee.bgInfo.additionalRemarks"
                        label="Additional Remarks"
                        prepend-inner-icon="mdi-note-text-outline"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-sheet>

                <v-card-actions class="px-0 pt-4">
                  <v-spacer />
                  <v-btn variant="text" @click="bgModalVisible = false" class="text-none"
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="primary"
                    class="text-none elevation-2"
                    @click="saveBgInfo(selectedEmployee.bgInfo)"
                  >
                    Save Professional Background
                  </v-btn>
                  <v-btn color="secondary" class="rounded-lg" @click="copyLink">Copy Link</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { employeeStore } from '@/stores/employee'
import { useAuthStore } from '@/stores/auth'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'

const store = employeeStore()
const auth = useAuthStore()
const router = useRouter()

if (!store.employees.length) {
  fetch('https://dummyjson.com/users')
    .then((res) => res.json())
    .then((data) => {
      store.employees = data.users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        bgInfo: {},
      }))
    })
}

const headers = [
  { title: 'Username', key: 'username', align: 'start' },
  { title: 'Email', key: 'email', align: 'start' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '150px' },
]

const search = ref('')
const employeesForTable = computed(() => store.employees)
const modalVisible = ref(false)
const bgModalVisible = ref(false)
const selectedEmployee = reactive({ id: null, username: '', email: '', bgInfo: {} })
const isEditing = ref(false)
const startMenu = ref(false)
const endMenu = ref(false)

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
})

function formatDate(dateValue) {
  if (!dateValue) return ''
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
  return date.toISOString().substring(0, 10)
}

function editEmployee(employee) {
  Object.assign(selectedEmployee, employee)
  isEditing.value = true
  modalVisible.value = true
}

function addEmployee() {
  Object.assign(selectedEmployee, {
    id: null,
    username: '',
    email: '',
    bgInfo: { startDate: null, endDate: null },
  })
  isEditing.value = false
  modalVisible.value = true
}

function saveInfo(values) {
  if (!isEditing.value) {
    store.addUser({ ...values, id: Date.now(), bgInfo: { startDate: null, endDate: null } })
  } else {
    store.updateUser(selectedEmployee.id, values)
  }
  modalVisible.value = false
}

function deleteEmployee(employee) {
  store.removeUser(employee.id)
}

function openBgInfo(employee) {
  if (!employee.bgInfo) employee.bgInfo = {}
  if (!employee.bgInfo.startDate) employee.bgInfo.startDate = null
  if (!employee.bgInfo.endDate) employee.bgInfo.endDate = null
  Object.assign(selectedEmployee, employee)
  bgModalVisible.value = true
}

function saveBgInfo(values) {
  selectedEmployee.bgInfo = { ...values }
  store.updateUser(selectedEmployee.id, { bgInfo: selectedEmployee.bgInfo })
  bgModalVisible.value = false
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

function copyLink() {
  const link = `${window.location.origin}/edit/${selectedEmployee.id}`
  navigator.clipboard
    .writeText(link)
    .then(() => {
      alert('Link copied to clipboard!')
    })
    .catch(() => {
      alert('Failed to copy the link.')
    })
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.v-btn.v-btn--icon {
  width: 32px;
  height: 32px;
  padding: 4px;
}

.v-btn .v-icon {
  font-size: 18px;
}
</style>
