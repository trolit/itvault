<template>
  <div class="file-page">
    <n-layout has-sider sider-placement="left">
      <n-layout-sider
        bordered
        show-trigger
        :width="250"
        :collapsed-width="0"
        collapse-mode="transform"
        :trigger-style="{
          borderRadius: 0,
          transform: 'translateX(50%) translateY(-100%)',
        }"
        :collapsed-trigger-style="{
          borderRadius: 0,
          transform: 'translateX(100%) translateY(100%)',
        }"
        :native-scrollbar="false"
      >
        <sider />
      </n-layout-sider>

      <n-layout-content>
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
              <template #default>
                <!-- @TODO scroll -->
                <variants v-if="variantTab" :active-tab="variantTab" />

                <empty v-else title="No variant selected." />
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
import Empty from "@/components/common/Empty.vue";
import { useWorkspacesStore } from "@/store/workspaces";

const workspacesStore = useWorkspacesStore();

const variantTab = computed((): string => {
  const tab = workspacesStore.activeFileTab;

  if (!tab) {
    return "";
  }

  return tab.activeVariantId;
});
</script>
