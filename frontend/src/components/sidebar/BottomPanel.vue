<template>
  <n-grid :cols="1" class="bottom-panel">
    <n-grid-item>
      <n-tooltip
        placement="top"
        trigger="hover"
        :show-arrow="false"
        :disabled="!isSidebarCollapsed"
      >
        <template #trigger>
          <n-button strong secondary type="primary">
            <n-icon v-if="isSidebarCollapsed" :size="25">
              <add-icon />
            </n-icon>

            <span v-else>New workspace</span>
          </n-button>
        </template>

        New workspace
      </n-tooltip>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Add as AddIcon } from "@vicons/carbon";
import { NButton, NGrid, NGridItem, NIcon, NTooltip } from "naive-ui";

import { usePreferencesStore } from "@/stores/preferences";

const preferencesStore = usePreferencesStore();

const isSidebarCollapsed = computed(() => {
  return preferencesStore.isSidebarCollapsed;
});
</script>
