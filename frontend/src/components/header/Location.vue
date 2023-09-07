<template>
  <div v-if="isOneOfRoutes" class="location">
    {{ activeWorkspace.name }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { useWorkspacesStore } from "@/store/workspaces";
import { ROUTE_WORKSPACE_NAME } from "@/assets/constants/routes";

const route = useRoute();

const workspacesStore = useWorkspacesStore();

const isOneOfRoutes = computed(() => {
  return route.name === ROUTE_WORKSPACE_NAME;
});

const activeWorkspace = computed(() => {
  return workspacesStore.activeItem;
});
</script>
