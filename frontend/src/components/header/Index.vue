<template>
  <n-page-header class="app-header" data-cy="app-header">
    <brand-dropdown />

    <span v-if="showWorkspacePanel">
      <workspace-dropdown
        @change-workspace="isSwitchWorkspaceModalVisible = true"
      />

      <switch-workspace-modal
        :is-visible="isSwitchWorkspaceModalVisible"
        @update:is-visible="isSwitchWorkspaceModalVisible = $event"
      />
    </span>

    <div class="actions">
      <n-button text :focusable="false">
        <n-icon
          :size="20"
          :component="generalStore.isChatVisible ? ChatOffIcon : ChatOnIcon"
          @click="generalStore.toggleChat"
        />
      </n-button>

      <profile-dropdown
        @toggle-permissions-modal="isPermissionsModalVisible = true"
      />
    </div>

    <permissions-modal
      :is-visible="isPermissionsModalVisible"
      @update:is-visible="isPermissionsModalVisible = $event"
    />
  </n-page-header>
</template>

<script setup lang="ts">
import {
  ChatOff as ChatOffIcon,
  ChatLaunch as ChatOnIcon,
} from "@vicons/carbon";
import { NPageHeader, NButton, NIcon } from "naive-ui";
import { ref, watch, onBeforeMount, computed } from "vue";
import { useRoute, type RouteRecordName } from "vue-router";

import { useAuthStore } from "@/store/auth";
import BrandDropdown from "./BrandDropdown.vue";
import { useGeneralStore } from "@/store/general";
import ProfileDropdown from "./ProfileDropdown.vue";
import PermissionsModal from "./PermissionsModal.vue";
import WorkspaceDropdown from "./WorkspaceDropdown.vue";
import SwitchWorkspaceModal from "./SwitchWorkspaceModal.vue";
import { ROUTE_WORKSPACES_NAME } from "@/assets/constants/routes";

const authStore = useAuthStore();
const generalStore = useGeneralStore();

onBeforeMount(() => {
  authStore.initializeSocket();
});

let isBrandHovered = ref<boolean>(false);
const isPermissionsModalVisible = ref(false);
const isSwitchWorkspaceModalVisible = ref(false);

const route = useRoute();

watch(
  (): RouteRecordName | null | undefined => route.name,
  (): void => {
    isBrandHovered.value = false;
  }
);

const showWorkspacePanel = computed(() => {
  if (!route.name) {
    return;
  }

  return [ROUTE_WORKSPACES_NAME].includes(route.name.toString());
});
</script>
