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
      :key="role.id"
      :name="role.id"
      :tab="role.name"
      v-for="{ role } in tabs"
    >
      xd
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from "naive-ui";
import { storeToRefs } from "pinia";

import { useRolesStore } from "@/store/roles";

const rolesStore = useRolesStore();

const { tabs } = storeToRefs(rolesStore);
</script>
