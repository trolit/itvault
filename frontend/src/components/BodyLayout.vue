<template>
  <n-layout
    has-sider
    class="page-body-layout"
    :class="{ 'sidebar-collapsed': isSidebarCollapsed }"
  >
    <n-layout-sider
      bordered
      show-trigger
      :width="240"
      collapse-mode="width"
      :collapsed-width="64"
      :collapsed="isSidebarCollapsed"
      @expand="toggleCollapse"
      @collapse="toggleCollapse"
    >
      <slot name="sidebar"> sidebar </slot>
    </n-layout-sider>

    <n-layout>
      <slot name="content"> content </slot>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NLayout, NLayoutSider } from "naive-ui";

import { usePreferencesStore } from "@/stores/preferences";

const preferencesStore = usePreferencesStore();

function toggleCollapse(): void {
  preferencesStore.toggleSidebar();
}

const isSidebarCollapsed = computed(() => {
  return preferencesStore.isSidebarCollapsed;
});
</script>
