import { reactive } from 'vue'

export function useSnackbar() {
  const snackbar = reactive({ show: false, message: '', color: 'success' })

  function showSnackbar(msg, color = 'success') {
    snackbar.message = msg
    snackbar.color = color
    snackbar.show = true
  }

  return { snackbar, showSnackbar }
}
