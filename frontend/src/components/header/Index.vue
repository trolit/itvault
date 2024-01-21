<template>
  <n-page-header class="app-header">
    <brand-dropdown />

    <location />

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
import { ref, watch, onBeforeMount } from "vue";
import { NPageHeader, NButton, NIcon } from "naive-ui";
import { useRoute, type RouteRecordName } from "vue-router";

import { useAuthStore } from "@/store/auth";
import BrandDropdown from "./BrandDropdown.vue";
import { useGeneralStore } from "@/store/general";
import ProfileDropdown from "./ProfileDropdown.vue";
import PermissionsModal from "./PermissionsModal.vue";
import Location from "@/components/header/Location.vue";
import ThemeSelector from "@/components/common/ThemeSelector.vue";

const authStore = useAuthStore();
const generalStore = useGeneralStore();

onBeforeMount(() => {
  authStore.initializeSocket();
});

let isBrandHovered = ref<boolean>(false);
const isPermissionsModalVisible = ref(false);

const route = useRoute();

watch(
  (): RouteRecordName | null | undefined => route.name,
  (): void => {
    isBrandHovered.value = false;
  }
);
</script>
