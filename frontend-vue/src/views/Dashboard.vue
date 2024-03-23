<template>
  <div class="dashboard-page page">
    <!-- @TODO x-gap should share value with --page-margin -->
    <n-grid
      x-gap="15"
      y-gap="20"
      class="grid"
      responsive="screen"
      cols="1 s:1 m:6 l:6 xl:6 2xl:6"
    >
      <n-grid-item span="2">
        <welcome-card />
      </n-grid-item>

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
import WelcomeCard from "@/components/dashboard/WelcomeCard.vue";
import WorkspacesCard from "@/components/dashboard/WorkspacesCard/Index.vue";
import AddEditWorkspaceDrawer from "@/components/dashboard/AddEditWorkspaceDrawer.vue";

const authStore = useAuthStore();

authStore.socketSendMessage({
  type: authStore.SOCKET_MESSAGE_TYPE.VIEW_DASHBOARD.TYPE,
});
</script>
