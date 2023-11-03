<template>
  <div class="roles-page page">
    <div class="header">
      <!-- @TODO -->
      <n-input clearable placeholder="Type name to filter" disabled>
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>
    </div>

    <n-grid
      x-gap="10"
      y-gap="10"
      responsive="screen"
      cols="1 s:1 m:3 l:3 xl:3 2xl:3"
    >
      <n-grid-item :span="isAddEditFormVisible ? 2 : 3">
        <roles-table @edit="isAddEditFormVisible = true" />
      </n-grid-item>

      <n-grid-item v-if="isAddEditFormVisible" span="1">
        <n-card title="Card" closable @close="isAddEditFormVisible = false">
          <add-edit-form />
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search as SearchIcon } from "@vicons/carbon";
import { NGrid, NIcon, NInput, NGridItem, NCard } from "naive-ui";

import RolesTable from "@/components/roles/Table.vue";
import AddEditForm from "@/components/roles/AddEditForm.vue";

const isAddEditFormVisible = ref(false);
</script>
