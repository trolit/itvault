<template>
  <n-page-header class="app-header" :style="{ borderBottom }">
    <brand v-if="isInDashboardView" />

    <router-link
      v-else
      :to="ROUTE_DASHBOARD_NAME"
      :style="{ color: isBrandHovered ? textColor : 'inherit' }"
      @mouseenter="isBrandHovered = true"
      @mouseleave="isBrandHovered = false"
    >
      <brand />
    </router-link>

    <location />

    <div class="actions">
      <theme-selector />

      <logout-button />
    </div>
  </n-page-header>
</template>

<script setup lang="ts">
import { NPageHeader, useThemeVars } from "naive-ui";
import { useRoute, type RouteRecordName } from "vue-router";
import { ref, computed, type ComputedRef, watch } from "vue";

import Brand from "@/components/common/Brand.vue";
import Location from "@/components/header/Location.vue";
import LogoutButton from "@/components/common/LogoutButton.vue";
import ThemeSelector from "@/components/common/ThemeSelector.vue";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";

const themeVars = useThemeVars();

let isBrandHovered = ref<boolean>(false);

const textColor = computed<string>((): string => {
  return themeVars.value.primaryColor;
});

const borderBottom = computed<string>((): string => {
  return `1px solid ${themeVars.value.borderColor}`;
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
