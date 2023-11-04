<template>
  <n-tabs
    type="card"
    closable
    animated
    justify-content="space-evenly"
    v-model:value="rolesStore.activeRoleId"
    @close="rolesStore.closeTab"
  >
    <n-tab-pane
      :key="tab.role.id"
      :name="tab.role.id"
      :tab="tab.role.name"
      v-for="tab in tabs"
    >
      <n-scrollbar trigger="none">
        <add-edit-form :role-tab="tab" />
      </n-scrollbar>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { NTabs, NTabPane, NScrollbar } from "naive-ui";

import AddEditForm from "./AddEditForm.vue";
import { useRolesStore } from "@/store/roles";

const rolesStore = useRolesStore();

const { tabs } = storeToRefs(rolesStore);
</script>
