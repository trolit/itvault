<template>
  <div class="variant-viewer">
    <n-card class="header" :bordered="false">
      <blueprint-selector />

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
import { h, onBeforeMount, ref, computed } from "vue";

import { useVariantsStore } from "@/store/variants";
import BlueprintSelector from "./BlueprintSelector.vue";

const text = ref("");
const variantsStore = useVariantsStore();

const props = defineProps({
  content: {
    type: String,
    required: true,
  },

  identifier: {
    type: String,
    required: true,
  },
});

onBeforeMount(async () => {
  if (!props.content) {
    try {
      text.value = await variantsStore.getContentById(props.identifier);
    } catch (error) {
      console.log(error);
    }
  }

  text.value = props.content;
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
