<template>
  <div class="variants">
    <n-tabs
      closable
      type="card"
      :value="props.activeTab"
      @close="variantsStore.closeTab"
      @update:value="variantsStore.setActiveTab"
    >
      <n-tab-pane
        v-for="variant in variants"
        :key="variant.value.id"
        :tab="variant.value.name"
        :name="variant.value.id"
      >
        <async-variant-viewer :variant="variant" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { NTabs, NTabPane, NSpin } from "naive-ui";

import { useFilesStore } from "@/store/files";
import { useVariantsStore } from "@/store/variants";

const filesStore = useFilesStore();
const variantsStore = useVariantsStore();

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
});

const variants = computed(() => {
  const tab = filesStore.getActiveTab();

  if (!tab) {
    return [];
  }

  return tab.variants;
});

// @TODO better error informing + loading component
const AsyncVariantViewer = defineAsyncComponent({
  loader: () => import("./VariantViewer/Index.vue"),
  loadingComponent: NSpin,
  delay: 100,
});
</script>
