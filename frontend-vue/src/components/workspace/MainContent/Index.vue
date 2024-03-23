<template>
  <div id="main-content">
    <loading-section v-if="isLoadingFileFromUrl" />

    <empty v-else-if="!tabs.length" title="Nothing to display 😢">
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

    <file-page v-else-if="filesStore.tabs.length" />

    <add-edit-blueprint-drawer />
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGridItem, NIcon } from "naive-ui";
import { Term as OptionIcon } from "@vicons/carbon";

import FilePage from "./FilePage/Index.vue";
import { useFilesStore } from "@/store/files";
import Empty from "@/components/common/Empty.vue";
import { defineComputed } from "@/helpers/defineComputed";
import AddEditBlueprintDrawer from "./AddEditBlueprintDrawer.vue";
import LoadingSection from "@/components/common/LoadingSection.vue";

const filesStore = useFilesStore();

interface IProps {
  isLoadingFileFromUrl: boolean;
}

defineProps<IProps>();

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

const { tabs } = defineComputed({
  tabs() {
    return filesStore.tabs;
  },
});
</script>
