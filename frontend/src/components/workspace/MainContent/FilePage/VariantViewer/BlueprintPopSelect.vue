<template>
  <n-popselect
    :value="data.id"
    :options="data.options"
    :render-label="renderLabel"
    @update:value="onBlueprintChange"
  >
    <n-button size="small">{{ data.name || "pick blueprint" }}</n-button>

    <!-- @TODO GetByIdController for Blueprint -->
    <template #action>
      or assign unused blueprint

      <div
        :style="{
          display: 'flex',
          columnGap: '15px',
          marginTop: '10px',
          alignItems: 'center',
        }"
      >
        <n-input />

        <n-button size="small">assign</n-button>
      </div>
    </template>
  </n-popselect>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import { NButton, NPopselect, NTag, NInput } from "naive-ui";

import { useFilesStore } from "@/store/files";
import type { SelectBaseOption } from "naive-ui/es/select/src/interface";

const filesStore = useFilesStore();

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

  return h("div", { style: { display: "flex", columnGap: "10px" } }, [
    h("div", {
      style: { backgroundColor: color, width: "20px", height: "20px" },
    }),
    h(NTag, { size: "small" }, color),
    h("span", label?.toString()),
  ]);
}

function onBlueprintChange(id: number) {
  const variantTab = filesStore.getActiveVariantTab();

  if (!variantTab) {
    return;
  }

  variantTab.activeBlueprintId = id;
}
</script>
