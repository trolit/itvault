<template>
  <n-page-header class="app-header" :style="{ borderBottom }">
    <router-link
      :to="ROUTE_DASHBOARD_NAME"
      :style="{ color: isBrandHovered ? textColor : 'inherit' }"
      @mouseenter="isBrandHovered = true"
      @mouseleave="isBrandHovered = false"
    >
      <brand />
    </router-link>

    <custom-menu />

    <div class="actions">
      <theme-selector />
    </div>
  </n-page-header>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { NPageHeader, useThemeVars } from "naive-ui";

import CustomMenu from "./Menu.vue";
import Brand from "@/components/common/Brand.vue";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";
import ThemeSelector from "@/components/common/ThemeSelector.vue";

const themeVars = useThemeVars();

let isBrandHovered = ref<boolean>(false);

const textColor = computed<string>((): string => {
  return themeVars.value.primaryColor;
});

const borderBottom = computed<string>((): string => {
  return `1px solid ${themeVars.value.borderColor}`;
});
</script>
