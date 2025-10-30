<template>
  <v-app>
    <v-main class="bg-grey-lighten-5">
      <v-container fluid class="py-10 px-6 mx-auto" style="max-width: 1200px">
        <v-row class="mb-6 align-center">
          <v-col cols="12" md="6">
            <h1 class="text-h4 font-weight-bold text-primary mb-1">Employee Directory</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Manage all personnel data efficiently</p>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end align-center gap-3">
            <v-btn color="error" class="text-none font-weight-medium elevation-3" large @click="handleLogout">
              <v-icon start>mdi-logout</v-icon> Logout
            </v-btn>
            <v-btn color="primary" class="text-none font-weight-medium elevation-3" large @click="addEmployee">
              <v-icon start>mdi-account-plus</v-icon> Add New Employee
            </v-btn>
          </v-col>
        </v-row>

        <v-card class="rounded-lg elevation-6">
          <DxDataGrid
            :data-source="employeeStore"
            key-expr="id"
            :remote-operations="{ filtering: true, sorting: true, paging: true }"
            :show-borders="true"
            :row-alternation-enabled="true"
            :column-auto-width="true"
            :allow-column-resizing="true"
            :hover-state-enabled="true"
            :show-row-lines="true"
            :show-column-lines="true"
          >
            <DxToolbar>
              <DxItem name="searchPanel" location="before" />
              <DxItem name="columnChooserButton" location="after" />
            </DxToolbar>

            <DxColumn data-field="username" caption="Username" :allow-sorting="true">
              <template #cell="{ data }">
                <span class="font-weight-medium text-primary cursor-pointer" @click="editEmployee(data.data)">
                  {{ data.data.username }}
                </span>
              </template>
            </DxColumn>

            <DxColumn data-field="email" caption="Email" />

            <DxColumn
              caption="Actions"
              data-field="actions"
              :allow-sorting="false"
              cell-template="actionCellTemplate"
              width="150"
              alignment="center"
            />

            <template #actionCellTemplate="{ data }">
              <div class="action-buttons">
                <v-btn icon color="primary" size="small" @click.stop="editEmployee(data.data)">
                  <v-icon size="18">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn icon color="secondary" size="small" @click.stop="openBgInfo(data.data)">
                  <v-icon size="18">mdi-file-document-outline</v-icon>
                </v-btn>
                <v-btn icon color="red-darken-2" size="small" @click.stop="deleteEmployee(data.data)">
                  <v-icon size="18">mdi-delete-outline</v-icon>
                </v-btn>
              </div>
            </template>

            <DxPaging :page-size="10" />
            <DxPager :show-page-size-selector="true" :allowed-page-sizes="[5, 10, 20]" :show-info="true" />
            <DxSearchPanel :visible="true" placeholder="Search employees..." :highlight-case-sensitive="false" :highlight-search-text="true" width="300" />
          </DxDataGrid>
        </v-card>

        <v-dialog v-model="modalVisible" max-width="600" transition="dialog-bottom-transition" persistent>
          <v-card class="rounded-xl elevation-8 modern-card">
            <v-toolbar flat class="modern-toolbar">
              <v-toolbar-title class="text-white text-h6 font-weight-medium">
                {{ isEditing ? 'Edit Employee' : 'Add New Employee' }}
              </v-toolbar-title>
              <v-spacer />
              <v-btn icon variant="text" @click="modalVisible = false">
                <v-icon color="white">mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text class="pa-6">
              <Form :validation-schema="schema" :initial-values="selectedEmployee" @submit="saveInfo">
                <v-row dense>
                  <v-col cols="12">
                    <Field name="username" v-slot="{ field, errors }">
                      <v-text-field v-bind="field" label="Username" variant="outlined" prepend-inner-icon="mdi-account-circle-outline" color="primary" class="rounded-lg" :error="errors.length > 0" :error-messages="errors" />
                    </Field>
                  </v-col>
                  <v-col cols="12">
                    <Field name="email" v-slot="{ field, errors }">
                      <v-text-field v-bind="field" label="Email" variant="outlined" prepend-inner-icon="mdi-email-outline" color="primary" class="rounded-lg" type="email" :error="errors.length > 0" :error-messages="errors" />
                    </Field>
                  </v-col>
                </v-row>

                <div class="text-end mt-6">
                  <v-btn variant="tonal" color="grey" class="text-none mr-3 rounded-lg" @click="modalVisible = false">
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

        <v-dialog v-model="bgModalVisible" max-width="900" transition="dialog-bottom-transition">
          <v-card class="rounded-xl">
            <v-toolbar color="primary" flat class="rounded-t-xl">
              <v-toolbar-title class="text-white text-h6 font-weight-regular">
                Professional Background - {{ selectedEmployee.username || 'New Employee' }}
              </v-toolbar-title>
              <v-spacer />
              <v-btn icon dark @click="bgModalVisible = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text class="pa-6" style="max-height: 70vh; overflow-y: auto">
              <v-form>
                <v-sheet class="pa-4 mb-4" elevation="1" rounded>
                  <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Employee Identification</h3>
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="selectedEmployee.bgInfo.name" label="Employee Name" prepend-inner-icon="mdi-badge-account-outline" variant="outlined" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="selectedEmployee.bgInfo.id" label="Employee ID" prepend-inner-icon="mdi-identifier" variant="outlined" />
                    </v-col>
                  </v-row>
                </v-sheet>

                <v-sheet class="pa-4 mb-4" elevation="1" rounded>
                  <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Employment Details</h3>
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="selectedEmployee.bgInfo.prevCompany" label="Previous Company" variant="outlined" prepend-inner-icon="mdi-office-building" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="selectedEmployee.bgInfo.designation" label="Designation" variant="outlined" prepend-inner-icon="mdi-briefcase-outline" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="selectedEmployee.bgInfo.salary" label="Salary" variant="outlined" prepend-inner-icon="mdi-cash" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="selectedEmployee.bgInfo.increment" label="Increment" variant="outlined" prepend-inner-icon="mdi-trending-up" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="selectedEmployee.bgInfo.startDate" label="Start Date" type="date" variant="outlined" prepend-inner-icon="mdi-calendar-start" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="selectedEmployee.bgInfo.endDate" label="End Date" type="date" variant="outlined" prepend-inner-icon="mdi-calendar-end" />
                    </v-col>
                  </v-row>
                </v-sheet>

                <v-sheet class="pa-4 mb-4" elevation="1" rounded>
                  <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Performance & Conduct</h3>
                  <v-row dense>
                    <v-col cols="12">
                      <v-textarea v-model="selectedEmployee.bgInfo.responsibilities" label="Responsibilities" rows="3" variant="outlined" />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea v-model="selectedEmployee.bgInfo.reasonLeaving" label="Reason for Leaving" rows="2" variant="outlined" />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea v-model="selectedEmployee.bgInfo.conduct" label="Conduct" rows="2" variant="outlined" />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea v-model="selectedEmployee.bgInfo.additionalRemarks" label="Additional Remarks" rows="2" variant="outlined" />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="selectedEmployee.bgInfo.reference" label="Reference" variant="outlined" prepend-inner-icon="mdi-account-tie-outline" />
                    </v-col>
                  </v-row>
                </v-sheet>

                <v-card-actions class="px-0 pt-4">
                  <v-spacer />
                  <v-btn variant="text" @click="bgModalVisible = false" class="text-none">Cancel</v-btn>
                  <v-btn color="primary" class="text-none elevation-2" @click="saveBgInfo(selectedEmployee.bgInfo)">
                    Save Professional Background
                  </v-btn>
                  <v-btn color="secondary" class="rounded-lg" @click="copyLink">Copy Link</v-btn>
                  <v-btn color="success" class="rounded-lg" @click="openMailModal">Send Mail</v-btn>

                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="mailModalVisible" max-width="600" transition="dialog-bottom-transition">
  <v-card class="rounded-xl">
    <v-toolbar color="primary" flat class="rounded-t-xl">
      <v-toolbar-title class="text-white text-h6 font-weight-regular">
        Send Mail - {{ selectedEmployee.username || 'Employee' }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon dark @click="mailModalVisible = false">
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
      <v-btn variant="text" @click="mailModalVisible = false" class="text-none">Cancel</v-btn>
      <v-btn color="primary" class="text-none elevation-2" @click="sendMail">Send</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
          {{ snackbar.message }}
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { apiClient } from '@/plugins/api'
import CustomStore from 'devextreme/data/custom_store'
import DataSource from 'devextreme/data/data_source'
import DxDataGrid, { DxColumn, DxPaging, DxPager, DxToolbar, DxItem, DxSearchPanel } from 'devextreme-vue/data-grid'
import 'devextreme/dist/css/dx.fluent.blue.light.css'


const mailModalVisible = ref(false)

const mailFormData = reactive({
  to: '',
  cc: '',
  bcc: '',
  companyName: '',
  message: ''
})
const auth = useAuthStore()
const router = useRouter()
const modalVisible = ref(false)
const bgModalVisible = ref(false)
const isEditing = ref(false)
const selectedEmployee = reactive({ id: null, username: '', email: '', bgInfo: {} })
const snackbar = reactive({ show: false, message: '', color: 'success' })
function showSnackbar(msg, color = 'success') { snackbar.message = msg; snackbar.color = color; snackbar.show = true }

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
})

const store = new CustomStore({
  key: 'id',
  async load(loadOptions) {
    const params = {}
    if (loadOptions.skip !== undefined) params.skip = loadOptions.skip
    if (loadOptions.take !== undefined) params.take = loadOptions.take
    if (loadOptions.searchValue) params.search = loadOptions.searchValue
    if (loadOptions.filter) params.filter = JSON.stringify(loadOptions.filter)

    const res = await apiClient.get('/employees', { params })
    console.log('Loaded employees:', res.data)
    return {
      data: res.data.data || [],
      totalCount: res.data.totalCount || 0
    }
  },
})

const employeeStore = new DataSource({ store })

async function addEmployee() {
  Object.assign(selectedEmployee, { id: null, username: '', email: '', bgInfo: {} })
  isEditing.value = false
  modalVisible.value = true
}

function editEmployee(emp) {
  Object.assign(selectedEmployee, JSON.parse(JSON.stringify(emp)))
  isEditing.value = true
  modalVisible.value = true
}

async function saveInfo(values) {
  try {
    if (isEditing.value) {
      const res = await apiClient.put(`/employees/${selectedEmployee.id}`, values)
      employeeStore.store().push([{ type: 'update', key: selectedEmployee.id, data: res.data }])
      showSnackbar('Employee updated successfully')
    } else {
      const res = await apiClient.post('/employees', values)
      employeeStore.store().push([{ type: 'insert', data: res.data }])
      showSnackbar('Employee added successfully')
    }
    modalVisible.value = false
  } catch { showSnackbar('Failed to save employee', 'error') }
}

async function deleteEmployee(emp) {
  try {
    await apiClient.delete(`/employees/${emp.id}`)
    employeeStore.store().push([{ type: 'remove', key: emp.id }])
    showSnackbar('Employee deleted')
  } catch { showSnackbar('Failed to delete', 'error') }
}

function openBgInfo(emp) {
  Object.assign(selectedEmployee, emp)
  if (!selectedEmployee.bgInfo) selectedEmployee.bgInfo = {}
  bgModalVisible.value = true
}

async function saveBgInfo(values) {
  try {
    const res = await apiClient.put(`/employees/${selectedEmployee.id}/bgInfo`, { bgInfo: values })
    employeeStore.store().push([{ type: 'update', key: selectedEmployee.id, data: { bgInfo: res.data.bgInfo } }])
    bgModalVisible.value = false
    showSnackbar('Background info updated')
  } catch { showSnackbar('Failed to save background info', 'error') }
}

async function handleLogout() {
  try { await apiClient.post('/auth/logout') } catch {}
  auth.logout()
  router.push('/login')
}

function copyLink() {
  const link = `${window.location.origin}/edit/${selectedEmployee.id}`
  navigator.clipboard.writeText(link)
    .then(() => showSnackbar('Link copied to clipboard'))
    .catch(() => showSnackbar('Copy failed', 'error'))
}



function openMailModal() {
  const link = `${window.location.origin}/edit/${selectedEmployee.id}`
  mailFormData.message = `Hi,\n\nPlease review the employee background details using the link below:\n${link}\n\nBest regards,\nYour HR Team`
  mailModalVisible.value = true
}

async function sendMail() {
  try {
    const link = `${window.location.origin}/edit/${selectedEmployee.id}`

    const payload = {
      user_id: selectedEmployee.id,
      to: mailFormData.to.split(',').map(e => e.trim()).filter(Boolean),
      cc: mailFormData.cc ? mailFormData.cc.split(',').map(e => e.trim()) : [],
      bcc: mailFormData.bcc ? mailFormData.bcc.split(',').map(e => e.trim()) : [],
      companyName: mailFormData.companyName,
      message: mailFormData.message,
      link
    }

    await apiClient.post('/mail/send', payload)

    mailModalVisible.value = false
    showSnackbar('Mail sent successfully')
  } catch (error) {
    console.error(error)
    showSnackbar('Failed to send mail', 'error')
  }
}


</script>

<style scoped>
.bg-grey-lighten-5 { background-color: #f5f7fa !important; }
.v-card, .v-sheet { border-radius: 16px; background-color: #fff; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08); }
.modern-toolbar { background: linear-gradient(90deg, #1976d2, #42a5f5); color: #fff !important; }
.action-buttons { display: flex; justify-content: center; align-items: center; gap: 8px; }
.v-btn.v-btn--icon { width: 36px; height: 36px; padding: 4px; }
</style> 