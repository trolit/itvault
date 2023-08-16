<template>
  <n-popselect :value="selectData.activeItem" :options="selectData.options">
    <n-button size="small">pick blueprint</n-button>
  </n-popselect>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NPopselect } from "naive-ui";

import { useFilesStore } from "@/store/files";

const filesStore = useFilesStore();

const selectData = computed(() => {
  const tab = filesStore.getActiveVariantTab();

  if (!tab) {
    return { activeItem: 0, options: [] };
  }

  const { activeBlueprintId, blueprints } = tab;

  return {
    activeItem: activeBlueprintId,
    options: blueprints.map(({ id, name }) => ({ label: name, value: id })),
  };
});
</script>
