<template>
  <div class="variant-viewer">
    <template v-if="text">
      <toolbar :is-bucket-modified="isBucketModified" />

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
import { NSpin, NScrollbar } from "naive-ui";
import { h, onBeforeMount, ref, type PropType } from "vue";

import Toolbar from "./Toolbar.vue";
import ColorPopover from "./ColorPopover.vue";
import Empty from "@/components/common/Empty.vue";
import { useVariantsStore } from "@/store/variants";
import type { VariantTab } from "@/types/VariantTab";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import decodeLineColoring from "@/helpers/decodeLineColoring";
import type { IBucketDto } from "@shared/types/dtos/IBucketDto";
import type { BucketContent } from "@shared/types/BucketContent";
import prepareLineForColoring from "@/helpers/prepareLineForColoring";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const text = ref("");
const isLoading = ref(false);
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps({
  variantTab: {
    type: Object as PropType<VariantTab>,
    required: true,
  },
});

const { numberOfLines, isBucketModified } = defineComputed({
  numberOfLines() {
    return text.value.split("\n").length;
  },

  isBucketModified() {
    const bucket = workspacesStore.activeBucket;

    if (bucket) {
      return (
        JSON.stringify(bucket.initialValue) !== JSON.stringify(bucket.value)
      );
    }

    return false;
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

function renderText(content: string) {
  let value = content;

  const bucket = workspacesStore.activeBucket;
  const blueprint = workspacesStore.activeBlueprintId;

  const splitText = value.toString().split("\n");

  const children = splitText.map((line, index) =>
    bucket && blueprint && line
      ? h(
          "div",
          { id: `line-${index}`, class: "line" },
          parseLineWithBucket(index, line, bucket, blueprint)
        )
      : h(line ? "div" : "br", { id: `line-${index}`, class: "line" }, line)
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
    part.isColored ? h(ColorPopover, { color, part }) : h("span", part.text)
  );
}
</script>
