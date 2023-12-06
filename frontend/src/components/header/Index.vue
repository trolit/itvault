<template>
  <n-page-header class="app-header">
    <brand v-if="isInDashboardView" />

    <router-link
      v-else
      :to="`/${ROUTE_DASHBOARD_NAME}`"
      :style="{ color: isBrandHovered ? textColor : 'inherit' }"
      @mouseenter="isBrandHovered = true"
      @mouseleave="isBrandHovered = false"
    >
      <brand />
    </router-link>

    <location />

    <div class="actions">
      <theme-selector>
        <template #default>
          <n-button text :focusable="false" class="theme-selector">
            <n-icon :component="RainDropIcon" :size="25" />
          </n-button>
        </template>
      </theme-selector>

      <profile-dropdown />
    </div>
  </n-page-header>
</template>

<script setup lang="ts">
import { RainDrop as RainDropIcon } from "@vicons/carbon";
import { useRoute, type RouteRecordName } from "vue-router";
import { ref, computed, type ComputedRef, watch, onBeforeMount } from "vue";
import { NPageHeader, useThemeVars, NButton, NIcon } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import Brand from "@/components/common/Brand.vue";
import ProfileDropdown from "./ProfileDropdown.vue";
import Location from "@/components/header/Location.vue";
import ThemeSelector from "@/components/common/ThemeSelector.vue";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";

const authStore = useAuthStore();
const themeVars = useThemeVars();

onBeforeMount(() => {
  authStore.initializeSocket();
});

let isBrandHovered = ref<boolean>(false);

const textColor = computed<string>((): string => {
  return themeVars.value.primaryColor;
});

const route = useRoute();

watch(
  (): RouteRecordName | null | undefined => route.name,
  (): void => {
    isBrandHovered.value = false;
  }
);

const isInDashboardView: ComputedRef<boolean> = computed(
  (): boolean => route.name === ROUTE_DASHBOARD_NAME
);
</script>
