<template>
  <div class="variant-viewer">
    <n-tabs
      closable
      type="card"
      v-model:value="activeTab"
      @close="variantsStore.closeVariantTab"
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
import { NTabs, NTabPane } from "naive-ui";
import { h, ref, computed } from "vue";

import { useVariantsStore } from "@/store/variants";

const variantsStore = useVariantsStore();

const activeTab = ref(variantsStore.variantTabs[0].instance.id);

/** */

const panels = computed(() => {
  const { variantTabs } = variantsStore;

  return variantTabs.map(({ instance, content }) => ({
    key: instance.id,
    tab: instance.name,
    content: "test1 test2\ntest3\ntest5", // @TODO
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
