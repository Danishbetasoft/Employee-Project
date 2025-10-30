import CustomStore from 'devextreme/data/custom_store'
import { apiClient } from '@/plugins/api'

export function createDxStore({ url, key = 'id' }) {
  return new CustomStore({
    key,
    loadMode: 'raw',
    load: async (loadOptions) => {
      try {
        const params = {
          skip: loadOptions.skip || 0,
          take: loadOptions.take || 10,
          sort: loadOptions.sort ? JSON.stringify(loadOptions.sort) : undefined,
          filter: loadOptions.filter ? JSON.stringify(loadOptions.filter) : undefined,
        }

        const res = await apiClient.get(url, { params })
        return {
          data: res.data.data,
          totalCount: res.data.totalCount,
        }
      } catch (error) {
        console.error('DXStore load error:', error)
        throw error
      }
    },
    insert: async (values) => {
      const res = await apiClient.post(url, values)
      return res.data
    },
    update: async (keyValue, values) => {
      const res = await apiClient.put(`${url}/${keyValue}`, values)
      return res.data
    },
    remove: async (keyValue) => {
      await apiClient.delete(`${url}/${keyValue}`)
    },
  })
}
