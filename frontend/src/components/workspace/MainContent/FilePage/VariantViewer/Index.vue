<template>
  <div class="variant-viewer">
    <n-card class="header" :bordered="false">
      <blueprint-pop-select />

      <n-button type="info" ghost>Save</n-button>
    </n-card>

    <n-scrollbar>
      <div class="line-numbers">
        <span v-for="index in numberOfLines" :key="index"></span>
      </div>

      <component :is="renderText(text)" />
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { NCard, NScrollbar, NButton } from "naive-ui";
import { h, onBeforeMount, ref, computed, type PropType } from "vue";

import { useVariantsStore } from "@/store/variants";
import type { VariantTab } from "@/types/VariantTab";
import BlueprintPopSelect from "./BlueprintPopSelect.vue";

const text = ref("");
const variantsStore = useVariantsStore();

const props = defineProps({
  variant: {
    type: Object as PropType<VariantTab>,
    required: true,
  },
});

onBeforeMount(async () => {
  const { variant } = props;

  if (!variant.content) {
    const {
      value: { id },
    } = variant;

    try {
      text.value = await variantsStore.getContentById(id);

      await variantsStore.getBlueprints();
    } catch (error) {
      console.log(error);
    }
  }

  text.value = variant.content;
});

const numberOfLines = computed((): number => {
  return text.value.split("\n").length;
});

function renderText(content: string) {
  let value = content;

  const splitText = value.toString().split("\n");

  const children = splitText.map(part => h("div", part));

  return h("div", { class: "text-render" }, children);
}
</script>
