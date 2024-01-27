<template>
  <n-page-header class="app-header">
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
          :size="25"
          :component="generalStore.isChatVisible ? ChatOffIcon : ChatOnIcon"
          @click="generalStore.toggleChat"
        />
      </n-button>

      <theme-selector>
        <template #default>
          <n-button text :focusable="false" class="theme-selector">
            <n-icon :component="RainDropIcon" :size="25" />
          </n-button>
        </template>
      </theme-selector>

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
  RainDrop as RainDropIcon,
} from "@vicons/carbon";
import { ref, watch, onBeforeMount, computed } from "vue";
import { NPageHeader, NButton, NIcon } from "naive-ui";
import { useRoute, type RouteRecordName } from "vue-router";

import {
  ROUTE_INSIGHTS_NAME,
  ROUTE_WORKSPACES_NAME,
} from "@/assets/constants/routes";
import { useAuthStore } from "@/store/auth";
import BrandDropdown from "./BrandDropdown.vue";
import { useGeneralStore } from "@/store/general";
import ProfileDropdown from "./ProfileDropdown.vue";
import PermissionsModal from "./PermissionsModal.vue";
import WorkspaceDropdown from "./WorkspaceDropdown.vue";
import SwitchWorkspaceModal from "./SwitchWorkspaceModal.vue";
import ThemeSelector from "@/components/common/ThemeSelector.vue";

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

  return [ROUTE_WORKSPACES_NAME, ROUTE_INSIGHTS_NAME].includes(
    route.name.toString()
  );
});
</script>
