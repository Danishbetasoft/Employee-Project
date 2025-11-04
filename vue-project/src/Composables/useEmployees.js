import { ref, computed, reactive } from 'vue'
import CustomStore from 'devextreme/data/custom_store'
import DataSource from 'devextreme/data/data_source'
import { apiemployee } from '@/plugins/employee'
import { useSnackbar } from './snackbar'

export default function useEmployee(
  params = {},
  customRefName = null
) {
  const { showSnackbar } = useSnackbar()

  const skipLoader = ref(true)
  const dataGridRefName = customRefName ?? ref('dataGrid')
  const refKey = ref('dataGrid')

  const modalVisible = ref(false)
  const bgModalVisible = ref(false)
  const mailModalVisible = ref(false)
  const isEditing = ref(false)
  const selectedEmployee = reactive({ id: null, username: '', email: '', bgInfo: {} })

  const employeeStore = new DataSource({
    store: new CustomStore({
      key: 'id',

      async load(loadOptions) {
        const dxKeys = ['skip', 'take', 'requireTotalCount', 'sort', 'filter']
        let queryParams = { ...params }

        dxKeys.forEach((key) => {
          if (key in loadOptions && loadOptions[key] !== undefined && loadOptions[key] !== null && loadOptions[key] !== '') {
            queryParams[key] = JSON.stringify(loadOptions[key])
          }
        })

        try {
          const res = await apiemployee.getAll(queryParams)
          if (skipLoader.value) skipLoader.value = false
          return {
            data: res.data.data || [],
            totalCount: res.data.totalCount || 0
          }
        } catch (err) {
          if (skipLoader.value) skipLoader.value = false
          throw new Error('Data Loading Error')
        }
      },

      async insert(values) {
        try {
          const res = await apiemployee.create(values)
          employeeStore.store().push([{ type: 'insert', data: res.data }])
          showSnackbar('Employee added successfully')
          return res.data
        } catch (err) {
          showSnackbar('Failed to add employee', 'error')
          throw err
        }
      },

      async update(key, values) {
        try {
          const res = await apiemployee.update(key, values)
          employeeStore.store().push([{ type: 'update', key, data: res.data }])
          showSnackbar('Employee updated successfully')
          return res.data
        } catch (err) {
          showSnackbar('Failed to update employee', 'error')
          throw err
        }
      },

      async remove(key) {
        try {
          await apiemployee.remove(key)
          employeeStore.store().push([{ type: 'remove', key }])
          showSnackbar('Employee deleted successfully')
        } catch (err) {
          showSnackbar('Failed to delete employee', 'error')
          throw err
        }
      }
    })
  })

  async function saveEmployee(employeeData) {
    if (isEditing.value) {
      await employeeStore.store().update(selectedEmployee.id, employeeData)
    } else {
      await employeeStore.store().insert(employeeData)
    }
  }

  async function deleteEmployee(employee) {
    if (confirm(`Are you sure you want to delete employee: ${employee.username}?`)) {
      await employeeStore.store().remove(employee.id)
    }
  }

  async function saveBgInfo(employeeData) {
    await employeeStore.store().update(employeeData.id, employeeData)
  }


  async function updateStatus(employee, newStatus) {
    try {
      const res = await apiemployee.updateBackground(employee.id, {
        bgInfo: employee.bgInfo,
        status: newStatus
      });
        employeeStore.store().update(employee.id, res.data);

      showSnackbar(`Employee status updated to ${newStatus}`, 'success');
     
    } catch (err) {
      showSnackbar('Failed to update status', 'error');
    }
  }
  
  
  const refName = computed(() => `dataGrid_${refKey.value}`)
  const dxGrid = computed(() => (dataGridRefName.value ? dataGridRefName.value.instance : null))
  const isMobile = computed(() => window.innerWidth <= 768)

  const refreshTable = (dataGridRef, changedOnly = false) => {
    if (!dataGridRef) {
      console.error("DataGrid ref not provided.");
      return;
    }
    const dataGrid = dataGridRef.value.instance;
    if (!dataGrid) {
      console.error("DataGrid instance not found.");
      return;
    }

    dataGrid.refresh(changedOnly);
  };
 
  return {
    updateStatus,
    employeeStore,
    modalVisible,
    bgModalVisible,
    mailModalVisible,
    isEditing,
    selectedEmployee,
    saveEmployee,
    deleteEmployee,
    saveBgInfo,
    refKey,
    dataGridRef: dataGridRefName,
    refName,
    dxGrid,
    isMobile,
    skipLoader,
    refreshTable
  }
}