<template>
  <div class="file-page">
    <n-tabs
      closable
      type="card"
      v-model:value="workspacesStore.activeFileId"
      @close="workspacesStore.closeFileTab"
    >
      <n-tab-pane
        v-for="{ file } in workspacesStore.tabs"
        :key="file.id"
        :tab="file.originalFilename"
        :name="file.id"
      >
        <n-card :bordered="false">
          <template #header>
            <card-header />
          </template>

          <!-- @TODO scroll -->
          <template #default>
            <variants v-if="variantTab" :active-tab="variantTab" />

            <empty v-else title="No variant selected." />
          </template>
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NCard, NTabs, NTabPane } from "naive-ui";

import Variants from "./Variants.vue";
import CardHeader from "./CardHeader.vue";
import Empty from "@/components/common/Empty.vue";
import { useWorkspacesStore } from "@/store/workspaces";

const workspacesStore = useWorkspacesStore();

const variantTab = computed((): string => {
  const tab = workspacesStore.activeFileTabValue;

  if (!tab) {
    return "";
  }

  return tab.activeVariantTab;
});
</script>
