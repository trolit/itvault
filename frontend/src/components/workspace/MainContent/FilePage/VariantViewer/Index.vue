<template>
  <!-- @close="variantsStore.closeVariantTab" -->
  <div class="variant-viewer">
    <n-tabs
      closable
      type="card"
      :value="props.activeTab"
      @close="variantsStore.closeTab"
      @update:value="variantsStore.setActiveTab"
    >
      <n-tab-pane
        v-for="{ key, tab, content } in panels"
        :key="key"
        :tab="tab"
        :name="key"
      >
        <div class="line-numbers">
          <span v-for="index in getNumberOfLines(content)" :key="index"></span>
        </div>

        <component :is="renderText(content)" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from "vue";
import { NTabs, NTabPane } from "naive-ui";

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

/** */

const panels = computed(() => {
  const tab = filesStore.getActiveTab();

  if (!tab) {
    return [];
  }

  return tab.variants
    .filter(variant => !variant.isVisible)
    .map(({ value, content }) => ({
      key: value.id,
      tab: value.name,
      content: `test1 test2\ntest3\n${tab.file.originalFilename}`, // @TODO
    }));
});

function getNumberOfLines(text: string) {
  return text.split("\n").length;
}

function renderText(text: string) {
  const splitText = text.toString().split("\n");

  const children = splitText.map(part => h("div", part));

  return h("div", { class: "text-render" }, children);
}
</script>
