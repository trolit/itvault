<template>
  <div class="variant-viewer">
    <n-card class="header" :bordered="false">
      <blueprint-pop-select @fetch-bucket="isLoading = $event" />

      <n-button type="info" ghost>Save</n-button>
    </n-card>

    <n-scrollbar>
      <div v-if="!isLoading" class="content">
        <div class="line-numbers">
          <span v-for="index in numberOfLines" :key="index"></span>
        </div>

        <component :is="renderText(text)" />
      </div>

      <!-- @TODO make common "wrapped" spinner component -->
      <div v-else>
        <n-spin />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { NCard, NScrollbar, NButton, NSpin } from "naive-ui";
import { h, onBeforeMount, ref, computed, type PropType } from "vue";

import { useVariantsStore } from "@/store/variants";
import type { VariantTab } from "@/types/VariantTab";
import BlueprintPopSelect from "./BlueprintPopSelect.vue";

const text = ref("");
const isLoading = ref(false);
const variantsStore = useVariantsStore();

const props = defineProps({
  variantTab: {
    type: Object as PropType<VariantTab>,
    required: true,
  },
});

onBeforeMount(async () => {
  const { variantTab } = props;

  if (!variantTab.content) {
    const {
      variant: { id },
    } = variantTab;

    isLoading.value = true;

    try {
      text.value = await variantsStore.getContentById(id);

      await variantsStore.getBlueprintsById(id);
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }

  text.value = variantTab.content;
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
