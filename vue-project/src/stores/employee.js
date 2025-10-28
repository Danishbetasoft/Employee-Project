import { defineStore } from 'pinia'

export const employeeStore = defineStore('employee', {
  id: 'employee',

  state: () => ({
    employees: [],
  }),

  getters: {
    employeeCount: (state) => state.employees.length,
    getUser: (state) => (id) => state.employees.find((emp) => emp.id === id),
  },

  actions: {
    async fetchEmployees() {
      try {
        const response = await fetch('https://dummyjson.com/users')
        const data = await response.json()
        this.employees = data.users.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          bgInfo: {},
        }))
      } catch (error) {
        console.error('Failed to fetch employees:', error)
      }
    },

    addUser(employee) {
      this.employees.push({ ...employee, id: Date.now() })
    },

    updateUser(id, updatedData) {
      const index = this.employees.findIndex((emp) => emp.id === id)
      if (index !== -1) {
        this.employees[index] = { ...this.employees[index], ...updatedData }
      }
    },

    removeUser(id) {
      this.employees = this.employees.filter((emp) => emp.id !== id)
    },
  },

  persist: {
    key: 'employee-store',
    paths: ['employees'],
    storage: localStorage,
  },
})
