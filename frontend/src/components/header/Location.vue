<template>
  <div v-if="isOneOfRoutes" class="location">
    {{ activeWorkspace.name }}

    <div>
      <small>
        {{ user.fullName }} -
        <n-tag size="tiny" type="info"> {{ user.roleName }} </n-tag>
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTag } from "naive-ui";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useWorkspacesStore } from "@/store/workspaces";
import { ROUTE_WORKSPACE_NAME } from "@/assets/constants/routes";

const route = useRoute();

const authStore = useAuthStore();
const workspacesStore = useWorkspacesStore();

const isOneOfRoutes = computed(() => {
  return route.name === ROUTE_WORKSPACE_NAME;
});

const user = computed(() => {
  return authStore.profile;
});

const activeWorkspace = computed(() => {
  return workspacesStore.activeItem;
});
</script>
