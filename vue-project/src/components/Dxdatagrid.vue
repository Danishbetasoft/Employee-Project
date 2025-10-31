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
  
      <DxColumn data-field="username" caption="Username" />
      <DxColumn data-field="email" caption="Email" />
      <DxColumn caption="Actions" cell-template="actionTemplate" :allow-sorting="false" :allow-filtering="false" />
  
      <DxPaging :page-size="10" />
      <DxPager :show-info="true" />
  
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
        </div>
      </template>
    </DxDataGrid>
  </template>
  
  <script setup>
  import DxDataGrid, { DxColumn, DxPaging, DxPager, DxToolbar, DxItem } from 'devextreme-vue/data-grid'
  
  defineProps({ store: Object })
  defineEmits(['edit', 'delete', 'background'])
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
  </style>