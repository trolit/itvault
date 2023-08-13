<template>
  <div id="main-content">
    <empty v-if="!hasSomethingToDisplay" title="Nothing to display 😢">
      <template #extra>
        <n-grid :x-gap="100" :cols="2">
          <n-grid-item v-for="(item, index) in gridItems" :key="index">
            <div>
              <n-icon :size="45" :component="item.icon" />
            </div>

            {{ item.text }}
          </n-grid-item>
        </n-grid>
      </template>
    </empty>

    <file-page v-else-if="filesStore.activeItem" />

    <add-edit-blueprint-drawer />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NGrid, NGridItem, NIcon } from "naive-ui";
import { Term as OptionIcon } from "@vicons/carbon";

import FilePage from "./FilePage/Index.vue";
import { useFilesStore } from "@/store/files";
import Empty from "@/components/common/Empty.vue";
import AddEditBlueprintDrawer from "./AddEditBlueprintDrawer.vue";

const filesStore = useFilesStore();

const gridItems = [
  {
    icon: OptionIcon,
    text: `Select file to manage it's variants and coloring.`,
  },
  {
    icon: OptionIcon,
    text: "Select bundle to view configuration.",
  },
];

const hasSomethingToDisplay = computed<boolean>((): boolean => {
  return !!filesStore.activeItem;
});
</script>
