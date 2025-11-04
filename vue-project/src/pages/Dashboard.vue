<template>
  <v-container>
    <ToolbarActions @add="openAddModal" @logout="logout" />

    <DxDataGrid
      :store="employeeStore"
      @edit="editEmployee"
      @delete="handleDelete"
      @background="openProfessionalBackground"
    />

    <AddEdit
      :visible="modalVisible"
      :employee="selectedEmployee"
      :is-editing="isEditing"
      @save="handleSave"
      @close="closeAddEditModal"
    />

    <ProfessionalBackground
      :visible="bgModalVisible"
      :employee="selectedEmployee"
      @save="handleBgSave"
      @close="closeBgModal"
      @copy="copyLink"
      @mail="handleOpenMailModal"
    />

    <MailModal
      :visible="mailModalVisible"
      :employee="selectedEmployee"
      :mail-form-data="mailFormData"
      @close="closeMailModal"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { reactive } from 'vue'
import DxDataGrid from '@/components/Dxdatagrid.vue'
import ToolbarActions from '@/pages/ToolbarActions.vue'
import AddEdit from '@/pages/AddEdit.vue'
import ProfessionalBackground from '@/pages/ProfessionalBackground.vue'
import MailModal from '@/pages/MailModal.vue'
import useEmployee from '@/Composables/useEmployees'
import { useSnackbar } from '@/Composables/snackbar'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const {
  employeeStore,
  modalVisible,
  bgModalVisible,
  mailModalVisible,
  isEditing,
  selectedEmployee,
  saveEmployee,
  deleteEmployee: deleteEmployeeComposable,
  saveBgInfo
} = useEmployee()

const { showSnackbar, snackbar } = useSnackbar()
const auth = useAuthStore()
const router = useRouter()

const mailFormData = reactive({
  to: '',
  companyName: '',
  message: '',
})

function logout() {
  auth.logout()
  router.push('/login')
}

function openAddModal() {
  Object.assign(selectedEmployee, { id: null, username: '', email: '', bgInfo: {} })
  isEditing.value = false
  modalVisible.value = true
}

function editEmployee(emp) {
  Object.assign(selectedEmployee, emp) 
  isEditing.value = true
  modalVisible.value = true
}

function openProfessionalBackground(emp) {
  Object.assign(selectedEmployee, {
    ...emp,
    bgInfo: emp.bgInfo || {}
  })
  bgModalVisible.value = true
}


function closeBgModal() {
  bgModalVisible.value = false
}

async function handleBgSave() {
  await saveBgInfo(selectedEmployee)
  closeBgModal()
}

async function handleSave(empData) {
  await saveEmployee(empData)
  modalVisible.value = false
}

async function handleDelete(emp) {
  await deleteEmployeeComposable(emp)
}

function closeAddEditModal() {
  modalVisible.value = false
  Object.assign(selectedEmployee, { id: null, username: '', email: '', bgInfo: {} })
}

function copyLink() {
  const link = `${window.location.origin}/edit/${selectedEmployee.id}`
  navigator.clipboard.writeText(link)
    .then(() => showSnackbar('Link copied to clipboard', 'success'))
    .catch(() => showSnackbar('Copy failed', 'error'))
}

function handleOpenMailModal() {
  const link = `${window.location.origin}/edit/${selectedEmployee.id}`
  
  mailFormData.to = selectedEmployee.email || ''
  mailFormData.message = `Hi,\n\nPlease review the employee background details using the link below:\n${link}\n\nBest regards,\nYour HR Team`
  
  bgModalVisible.value = false
  mailModalVisible.value = true
}

function closeMailModal() {
  mailModalVisible.value = false
  Object.assign(selectedEmployee, { id: null, username: '', email: '', bgInfo: {} }) 
}
</script>