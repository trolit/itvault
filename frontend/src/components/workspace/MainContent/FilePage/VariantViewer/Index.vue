<template>
  <div class="variant-viewer">
    <template v-if="text">
      <n-card class="header" :bordered="false">
        <n-space>
          <n-switch :round="false">
            <template #checked> Write </template>
            <template #unchecked> Read </template>
          </n-switch>

          <blueprint-pop-select />
        </n-space>

        <n-space v-if="isBucketModified" align="center">
          <small>New changes</small>

          <n-popconfirm @positive-click="bucketsStore.resetActiveBucketValue">
            <template #trigger>
              <n-button type="warning" ghost> Discard </n-button>
            </template>

            Are you sure?
          </n-popconfirm>

          <n-button type="success" ghost> Save </n-button>
        </n-space>
      </n-card>

      <n-scrollbar>
        <div class="content">
          <div class="line-numbers">
            <span v-for="index in numberOfLines" :key="index"></span>
          </div>

          <component :is="renderText(text)" />
        </div>
      </n-scrollbar>
    </template>

    <!-- @TODO make common "wrapped" spinner component -->
    <div class="loading" v-else-if="isLoading">
      <n-spin />
    </div>

    <empty v-else title="Variant not found." />
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NSpin,
  NSpace,
  NButton,
  NSwitch,
  NScrollbar,
  NPopconfirm,
} from "naive-ui";
import { h, onBeforeMount, ref, computed, type PropType } from "vue";

import ColorPopover from "./ColorPopover.vue";
import { useBucketsStore } from "@/store/buckets";
import Empty from "@/components/common/Empty.vue";
import { useVariantsStore } from "@/store/variants";
import type { VariantTab } from "@/types/VariantTab";
import { useWorkspacesStore } from "@/store/workspaces";
import BlueprintPopSelect from "./BlueprintPopSelect.vue";
import decodeLineColoring from "@/helpers/decodeLineColoring";
import type { IBucketDto } from "@shared/types/dtos/IBucketDto";
import type { BucketContent } from "@shared/types/BucketContent";
import prepareLineForColoring from "@/helpers/prepareLineForColoring";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const text = ref("");
const isLoading = ref(false);
const bucketsStore = useBucketsStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

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

const isBucketModified = computed(() => {
  const bucket = workspacesStore.activeBucket;

  if (bucket) {
    return JSON.stringify(bucket.initialValue) !== JSON.stringify(bucket.value);
  }

  return false;
});

function renderText(content: string) {
  let value = content;

  const bucket = workspacesStore.activeBucket;
  const blueprint = workspacesStore.activeBlueprintId;

  const splitText = value.toString().split("\n");

  const children = splitText.map((line, index) =>
    bucket && blueprint && line
      ? h("div", parseLineWithBucket(index, line, bucket, blueprint))
      : h(line ? "div" : "br", line)
  );

  return h("div", { class: "text-render" }, children);
}

function parseLineWithBucket(
  index: number,
  line: string,
  bucket: IBucketDto,
  blueprint: IBlueprintDto
) {
  const { value } = bucket;
  const { color } = blueprint;

  const key = Object.keys(value).find(key => parseInt(key) === index);

  if (!key) {
    return h("div", line);
  }

  const coloring = value[index as keyof BucketContent];

  const { iterations, parsedColors } = decodeLineColoring(line, coloring);

  const preparedLine = prepareLineForColoring(
    index,
    line,
    iterations,
    parsedColors
  );

  return preparedLine.map(part =>
    part.location ? h(ColorPopover, { color, part }) : h("span", part.text)
  );
}
</script>
