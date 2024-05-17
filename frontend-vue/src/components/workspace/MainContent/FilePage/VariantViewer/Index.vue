<template>
  <div class="variant-viewer">
    <template v-if="text">
      <toolbar :is-bucket-modified="isBucketModified" />

      <n-scrollbar x-scrollable>
        <div class="content">
          <div class="line-numbers">
            <span v-for="index in numberOfLines" :key="index" />
          </div>

          <component :is="renderText(text)" @mouseup.stop="onMouseUp" />
        </div>

        <assign-color-popover
          v-if="!!bucketsStore.activeItem"
          :is-visible="isAssignColorPopoverVisible"
          :x="assignColorPopoverX"
          :y="assignColorPopoverY"
          :selection-data="selectionData"
          @update:is-visible="isAssignColorPopoverVisible = false"
        />
      </n-scrollbar>
    </template>

    <loading-section v-else-if="isLoading" />

    <empty v-else title="Variant not found." />
  </div>
</template>

<script setup lang="ts">
import { NScrollbar } from "naive-ui";
import { h, ref, type PropType, type Ref, onBeforeMount } from "vue";

import Toolbar from "./Toolbar.vue";
import { useFilesStore } from "@/store/files";
import Empty from "@/components/common/Empty.vue";
import { useBucketsStore } from "@/store/buckets";
import { useVariantsStore } from "@/store/variants";
import type { VariantTab } from "@/types/VariantTab";
import { useBlueprintsStore } from "@/store/blueprints";
import AssignColorPopover from "./AssignColorPopover.vue";
import { defineComputed } from "@/helpers/defineComputed";
import type { IBucketDTO } from "@shared/types/DTOs/Bucket";
import UnassignColorPopover from "./UnassignColorPopover.vue";
import decodeLineColoring from "@/helpers/decodeLineColoring";
import type { BucketContent } from "@shared/types/BucketContent";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";
import LoadingSection from "@/components/common/LoadingSection.vue";
import prepareLineForColoring from "@/helpers/prepareLineForColoring";
import type { AssignColorSelectionData } from "@/types/AssignColorSelectionData";

const text = ref("");
const isLoading = ref(false);
const filesStore = useFilesStore();
const bucketsStore = useBucketsStore();
const variantsStore = useVariantsStore();
const blueprintsStore = useBlueprintsStore();
const assignColorPopoverX = ref(0);
const assignColorPopoverY = ref(0);
const isAssignColorPopoverVisible = ref(false);
const selectionData: Ref<AssignColorSelectionData> = ref({
  startLineIndex: 0,
  endLineIndex: 0,
  anchorChildrenIndex: 0,
  focusChildrenIndex: 0,
  anchorOffset: 0,
  focusOffset: 0,
});

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
    const bucket = bucketsStore.activeItem;

    if (bucket) {
      return (
        JSON.stringify(bucket.initialValue) !== JSON.stringify(bucket.value)
      );
    }

    return false;
  },
});

onBeforeMount(async () => {
  const { variant } = props.variantTab;

  isLoading.value = true;

  await loadVariantData(variant.id);

  // @NOTE load blueprint (via bundle)
  if (filesStore.activeTab?.blueprintIdToLoad) {
    variantsStore.setActiveTabBlueprint(filesStore.activeTab.blueprintIdToLoad);

    filesStore.activeTab.blueprintIdToLoad = undefined;
  }
});

async function loadVariantData(variantId: string) {
  const { content } = props.variantTab;

  if (!content) {
    try {
      text.value = await variantsStore.getContentById(variantId);

      await variantsStore.getBlueprintsById(variantId);
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  } else {
    text.value = content;
  }
}

function renderText(content: string) {
  let value = content;

  const bucket = bucketsStore.activeItem;
  const blueprint = blueprintsStore.activeItem;

  const splitText = value.toString().split("\n");

  const children = splitText.map((line, index) =>
    bucket && blueprint && line
      ? h(
          "div",
          {
            id: bucketsStore.getLineId(index),
            class: bucketsStore.LINE_CLASS_NAME,
          },
          parseLineWithBucket(index, line, bucket, blueprint)
        )
      : h(
          line ? "div" : "br",
          {
            id: bucketsStore.getLineId(index),
            class: bucketsStore.LINE_CLASS_NAME,
          },
          line
        )
  );

  return h("pre", { class: "text-render" }, children);
}

function parseLineWithBucket(
  index: number,
  line: string,
  bucket: IBucketDTO,
  blueprint: IBlueprintDTO
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
    part.isColored
      ? h(UnassignColorPopover, { color, part })
      : h("span", part.text)
  );
}

async function onMouseUp(event: MouseEvent) {
  if (!variantsStore.isActiveTabInWriteMode) {
    return;
  }

  if (isAssignColorPopoverVisible.value) {
    isAssignColorPopoverVisible.value = false;
  }

  const selection = window.getSelection();

  if (!selection || selection?.type === "Caret") {
    return;
  }

  const { focusNode, anchorNode, focusOffset, anchorOffset } = selection;

  if (!focusNode || !anchorNode) {
    return;
  }

  const position = anchorNode.compareDocumentPosition(focusNode);
  let isBackwardSelection = false;

  if (
    (!position && anchorOffset > focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  ) {
    isBackwardSelection = true;
  }

  if (anchorNode.nodeName !== "#text" || focusNode.nodeName !== "#text") {
    return;
  }

  const { parentElement: parentAnchorElement } = anchorNode;
  const { parentElement: parentFocusElement } = focusNode;

  if (!parentAnchorElement || !parentFocusElement) {
    return;
  }

  const anchorNodeDiv = parentAnchorElement.closest(
    `.${bucketsStore.LINE_CLASS_NAME}`
  );
  const focusNodeDiv = parentFocusElement.closest(
    `.${bucketsStore.LINE_CLASS_NAME}`
  );

  if (!anchorNodeDiv || !focusNodeDiv) {
    return;
  }

  const startLine = anchorNodeDiv.id.split("-").pop();
  const endLine = focusNodeDiv.id.split("-").pop();

  if (!startLine || !endLine) {
    return;
  }

  const parsedStartLine = parseInt(startLine);
  const parsedEndLine = parseInt(endLine);

  const anchorNodeIndex = Array.from(anchorNodeDiv.children).indexOf(
    parentAnchorElement
  );

  const focusNodeIndex = Array.from(focusNodeDiv.children).indexOf(
    parentFocusElement
  );

  const data = isBackwardSelection
    ? {
        anchorChildrenIndex: focusNodeIndex,
        focusChildrenIndex: anchorNodeIndex,
        anchorOffset: focusOffset,
        focusOffset: anchorOffset,
      }
    : {
        anchorChildrenIndex: anchorNodeIndex,
        focusChildrenIndex: focusNodeIndex,
        anchorOffset,
        focusOffset,
      };

  isAssignColorPopoverVisible.value = true;

  assignColorPopoverX.value = event.clientX;
  assignColorPopoverY.value = event.clientY;

  selectionData.value = {
    startLineIndex: parsedStartLine,
    endLineIndex: parsedEndLine,
    ...data,
  };
}
</script>
