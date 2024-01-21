<template>
  <div class="dashboard-page page">
    <n-grid
      x-gap="10"
      y-gap="20"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:6 l:6 xl:6 2xl:6"
    >
      <n-grid-item :span="6">
        <welcome />
      </n-grid-item>

      <n-grid-item span="2"> @TODO </n-grid-item>

      <n-grid-item class="workspaces-card-wrapper" span="4">
        <workspaces-card />
      </n-grid-item>
    </n-grid>

    <add-edit-workspace-drawer />
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGridItem } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import Welcome from "@/components/dashboard/Welcome.vue";
import WorkspacesCard from "@/components/dashboard/Workspaces.vue";
import AddEditWorkspaceDrawer from "@/components/dashboard/AddEditWorkspaceDrawer.vue";

const authStore = useAuthStore();

authStore.socketSendMessage({
  type: authStore.SOCKET_MESSAGE_TYPE.VIEW_DASHBOARD.TYPE,
});
</script>
