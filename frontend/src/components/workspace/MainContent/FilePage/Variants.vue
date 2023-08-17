<template>
  <div class="variants">
    <n-tabs
      closable
      type="card"
      :value="props.activeTab"
      @close="variantsStore.closeTab"
      @update:value="workspacesStore.setVariantTab"
    >
      <n-tab-pane
        v-for="tab in variantTabs"
        :key="tab.variant.id"
        :tab="tab.variant.name"
        :name="tab.variant.id"
      >
        <async-variant-viewer :variant-tab="tab" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { NTabs, NTabPane, NSpin } from "naive-ui";

import { useVariantsStore } from "@/store/variants";
import { useWorkspacesStore } from "@/store/workspaces";

const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
});

const variantTabs = computed(() => {
  const tab = workspacesStore.activeFileTabValue;

  if (!tab) {
    return [];
  }

  return tab.variantTabs;
});

// @TODO better error informing + loading component
const AsyncVariantViewer = defineAsyncComponent({
  loader: () => import("./VariantViewer/Index.vue"),
  loadingComponent: NSpin,
  delay: 100,
});
</script>
