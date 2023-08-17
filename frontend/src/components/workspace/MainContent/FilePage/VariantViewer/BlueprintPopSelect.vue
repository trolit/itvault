<template>
  <n-popselect
    :value="data.id"
    :options="data.options"
    :render-label="renderLabel"
    @update:value="onBlueprintChange"
  >
    <n-button size="small">{{ data.name || "pick blueprint" }}</n-button>

    <!-- @TODO fetch blueprints matching input (+ allow to pick) -->
    <template #action>
      <div
        :style="{
          display: 'flex',
          columnGap: '15px',
          marginBottom: '5px',
          alignItems: 'center',
        }"
      >
        <n-input clearable placeholder="Type name or color" />

        <n-button size="small" disabled>assign</n-button>
      </div>

      <small class="flex align-items-center">
        This gives only 5 suggestions. Use
        <n-button size="tiny" quaternary type="info">blueprints</n-button> tab
        to view more.
      </small>
    </template>
  </n-popselect>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import isEmpty from "lodash/isEmpty";
import { NButton, NPopselect, NTag, NInput } from "naive-ui";

import { useFilesStore } from "@/store/files";
import { useVariantsStore } from "@/store/variants";
import type { SelectBaseOption } from "naive-ui/es/select/src/interface";

const filesStore = useFilesStore();
const variantsStore = useVariantsStore();

const data = computed(() => {
  const tab = filesStore.getActiveVariantTab();

  if (!tab) {
    return { id: 0, options: [] };
  }

  const { activeBlueprintId, blueprints } = tab;

  const activeBlueprint = blueprints.find(
    blueprint => blueprint.id === activeBlueprintId
  );

  return {
    id: activeBlueprintId,
    name: activeBlueprint?.name,
    options: blueprints.map(({ id, name, color }) => ({
      label: name,
      value: id,
      color: color,
    })),
  };
});

function renderLabel(option: SelectBaseOption & { color: string }) {
  const { label, color } = option;

  return h(
    "div",
    { class: "flex align-items-center", style: { columnGap: "5px" } },
    [
      h("div", {
        style: { backgroundColor: color, width: "15px", height: "15px" },
      }),
      h(
        NTag,
        { size: "small" },
        {
          default: () => color,
        }
      ),
      h("span", label?.toString()),
    ]
  );
}

async function onBlueprintChange(id: number) {
  const variantTab = filesStore.getActiveVariantTab();

  if (!variantTab) {
    return;
  }

  variantTab.activeBlueprintId = id;

  const activeBlueprint = variantTab.blueprints.find(
    blueprint => blueprint.id === id
  );

  if (!activeBlueprint || !isEmpty(activeBlueprint.bucket.value)) {
    return;
  }

  try {
    await variantsStore.getBucketById(variantTab.value.id);
  } catch (error) {
    console.log(error);
  }
}
</script>
