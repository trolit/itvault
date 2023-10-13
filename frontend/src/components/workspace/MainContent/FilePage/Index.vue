<template>
  <div class="file-page">
    <n-layout has-sider sider-placement="left" :style="{ zIndex: 500 }">
      <n-layout-sider
        bordered
        show-trigger
        :width="250"
        :collapsed-width="0"
        collapse-mode="transform"
        :trigger-style="{
          left: 0,
          borderRadius: 0,
          top: workspacesStore.TRIGGER_STYLE_TOP,
          height: workspacesStore.TRIGGER_STYLE_HEIGHT,
          transform: 'translateX(0%) translateY(0%)',
        }"
        :collapsed-trigger-style="{
          left: 0,
          borderRadius: 0,
          top: workspacesStore.TRIGGER_STYLE_TOP,
          height: workspacesStore.TRIGGER_STYLE_HEIGHT,
          transform: 'translateX(0%) translateY(0%)',
        }"
      >
        <sider />
      </n-layout-sider>

      <n-layout-content>
        <n-tabs
          closable
          type="card"
          v-model:value="filesStore.activeFileId"
          @close="filesStore.closeTab"
        >
          <n-tab-pane
            v-for="{ file } in filesStore.tabs"
            :key="file.id"
            :tab="file.originalFilename"
            :name="file.id"
          >
            <n-card :bordered="false">
              <template #default>
                <variants v-if="variantId" :active-tab="variantId" />

                <empty v-else title="Select variant" />
              </template>
            </n-card>
          </n-tab-pane>
        </n-tabs>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  NCard,
  NTabs,
  NLayout,
  NTabPane,
  NLayoutSider,
  NLayoutContent,
} from "naive-ui";

import Sider from "./Sider.vue";
import Variants from "./Variants.vue";
import { useFilesStore } from "@/store/files";
import Empty from "@/components/common/Empty.vue";
import { useWorkspacesStore } from "@/store/workspaces";

const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

const variantId = computed((): string => {
  const tab = filesStore.activeTab;

  if (!tab) {
    return "";
  }

  return tab.activeVariantId;
});
</script>
