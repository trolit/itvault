<template>
  <div class="file-page">
    <n-tabs
      closable
      type="card"
      v-model:value="filesStore.activeTabId"
      @close="filesStore.closeFileTab"
    >
      <n-tab-pane
        v-for="{ file, variants } in filesStore.tabs"
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
            <variant-viewer v-if="variants.length" />

            <empty v-else title="No variant selected." />
          </template>
        </n-card>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTabs, NTabPane } from "naive-ui";

import CardHeader from "./CardHeader.vue";
import { useFilesStore } from "@/store/files";
import Empty from "@/components/common/Empty.vue";
import VariantViewer from "./VariantViewer/Index.vue";

const filesStore = useFilesStore();
</script>
