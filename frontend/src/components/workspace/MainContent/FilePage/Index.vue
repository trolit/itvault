<template>
  <div class="file-page">
    <n-layout has-sider sider-placement="left" :style="{ zIndex: 500 }">
      <n-layout-sider
        bordered
        show-trigger
        :width="workspacesStore.FILE_PAGE_SIDER_WIDTH"
        :collapsed-width="0"
        collapse-mode="transform"
        :collapsed="workspacesStore.isFilePageSiderCollapsed"
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
        @expand="workspacesStore.toggleFilePageSider"
        @collapse="workspacesStore.toggleFilePageSider"
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
            v-for="tab in filesStore.tabs"
            :key="tab.file.id"
            :tab="getTabTitle(tab)"
            :name="tab.file.id"
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
import {
  NCard,
  NTabs,
  NSpace,
  NButton,
  NLayout,
  NPopover,
  NTabPane,
  NLayoutSider,
  NLayoutContent,
} from "naive-ui";
import { computed, h } from "vue";

import Sider from "./Sider.vue";
import Variants from "./Variants.vue";
import { useFilesStore } from "@/store/files";
import type { FileTab } from "@/types/FileTab";
import Empty from "@/components/common/Empty.vue";
import { useVariantsStore } from "@/store/variants";
import { useWorkspacesStore } from "@/store/workspaces";

const filesStore = useFilesStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const variantId = computed((): string => {
  const tab = filesStore.activeTab;

  if (!tab) {
    return "";
  }

  return tab.activeVariantId;
});

function getTabTitle(tab: FileTab) {
  return h(
    NPopover,
    {
      placement: "bottom",
    },
    {
      trigger: () => tab.file.originalFilename,
      default: () => {
        const buttons = tab.variantTabs.map(tab =>
          h(
            NButton,
            {
              disabled: tab.variant.id === variantId.value,
              size: "tiny",
              onClick: () => {
                variantsStore.setActiveTab(tab.variant.id);
              },
            },
            { default: () => tab.variant.name }
          )
        );

        return h(
          NSpace,
          {},
          {
            default: () => buttons,
          }
        );
      },
    }
  );
}
</script>
