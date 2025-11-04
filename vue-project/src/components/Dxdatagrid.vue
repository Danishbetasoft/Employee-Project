<template>
  <DxDataGrid
    :data-source="store"
    key-expr="id"
    :show-borders="true"
    :row-alternation-enabled="true"
    :column-auto-width="true"
    :remote-operations="true"
  >
    <DxToolbar>
      <DxItem name="searchPanel" location="before" />
      <DxItem name="columnChooserButton" location="after" />
    </DxToolbar>

    <DxColumn data-field="username" caption="Username" alignment="center" />
    <DxColumn data-field="email" caption="Email" alignment="center" />
    <DxColumn
      data-field="status"
      caption="Status"
      cell-template="statusTemplate"
      alignment="center"
    />
    <DxColumn
      caption="Actions"
      cell-template="actionTemplate"
      :allow-sorting="false"
      :allow-filtering="false"
      alignment="center"
    />

    <DxPaging :page-size="10" />
    <DxPager :show-info="true" />

    <template #statusTemplate="{ data }">
      <v-chip
        small
        :color="getStatusColor(data.data.status)"
        text-color="white"
      >
        {{ data.data.status }}
      </v-chip>
    </template>

    <template #actionTemplate="{ data }">
      <div class="action-buttons">
        <v-btn icon color="primary" small @click.stop="$emit('edit', data.data)">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn icon color="error" small @click.stop="$emit('delete', data.data)">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
        <v-btn icon color="teal" small @click.stop="$emit('background', data.data)">
          <v-icon>mdi-briefcase-outline</v-icon>
        </v-btn>
        <v-btn
          v-if="data.data.status === 'pending'"
          icon
          color="success"
          small
          @click.stop="$emit('update-status', { employee: data.data, status: 'verified' })"
        >
          <v-icon>mdi-check-outline</v-icon>
        </v-btn>
        <v-btn
          v-if="data.data.status === 'pending'"
          icon
          color="warning"
          small
          @click.stop="$emit('update-status', { employee: data.data, status: 'rejected' })"
        >
          <v-icon>mdi-close-outline</v-icon>
        </v-btn>
      </div>
    </template>
  </DxDataGrid>
</template>

<script setup>
import DxDataGrid, { DxColumn, DxPaging, DxPager, DxToolbar, DxItem } from 'devextreme-vue/data-grid'

defineProps({ store: Object })
defineEmits(['edit', 'delete', 'background', 'update-status'])

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'verified': return 'green'
    case 'pending': return 'orange'
    case 'rejected': return 'red'
    default: return 'grey'
  }
}
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 6px;
}
.v-btn.v-btn--icon {
  width: 32px;
  height: 32px;
  padding: 0;
}
::v-deep(.dx-datagrid-headers .dx-datagrid-text-content) {
  text-align: center !important;
}
</style>
