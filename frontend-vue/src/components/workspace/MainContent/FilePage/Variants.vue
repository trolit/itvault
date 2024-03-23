<template>
  <div class="variants">
    <n-tabs
      closable
      type="card"
      :value="activeTab"
      @close="variantsStore.closeTab"
      @update:value="variantsStore.setActiveTab"
    >
      <n-tab-pane
        v-for="tab in variantTabs"
        :key="tab.variant.id"
        :name="tab.variant.id"
        :tab="tab.variant.name"
      >
        <async-variant-viewer :variant-tab="tab" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane, NSpin } from "naive-ui";
import { computed, defineAsyncComponent } from "vue";

import { useFilesStore } from "@/store/files";
import { useVariantsStore } from "@/store/variants";

const filesStore = useFilesStore();
const variantsStore = useVariantsStore();

defineProps({
  activeTab: {
    type: String,
    required: true,
  },
});

const variantTabs = computed(() => {
  const tab = filesStore.activeTab;

  if (!tab) {
    return [];
  }

  return tab.variantTabs.filter(tab => tab.isVisible);
});

// @TODO better error informing + loading component
const AsyncVariantViewer = defineAsyncComponent({
  loader: () => import("./VariantViewer/Index.vue"),
  loadingComponent: NSpin,
  delay: 100,
});
</script>
