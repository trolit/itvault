<template>
  <n-popselect
    cancelable
    :value="data.id"
    :options="data.options"
    :render-label="renderLabel"
    @update:value="workspacesStore.setVariantTabActiveBlueprint($event)"
  >
    <n-button size="small" :loading="isLoading">
      {{ data.name || "pick blueprint" }}
    </n-button>

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
import { computed, h, ref, watch } from "vue";
import { NButton, NPopselect, NTag, NInput } from "naive-ui";

import { useVariantsStore } from "@/store/variants";
import type { SelectBaseOption } from "naive-ui/es/select/src/interface";
import { useWorkspacesStore } from "@/store/workspaces";

const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);

const data = computed(() => {
  const variantTab = workspacesStore.activeVariantTab;

  if (!variantTab) {
    return { id: 0, options: [] };
  }

  const { activeBlueprintId: id, blueprints } = variantTab;

  return {
    id,
    name: workspacesStore.activeBlueprintId?.name,
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

watch(data, async () => {
  const blueprintId = data.value.id;
  const variantId = workspacesStore.activeFileTab?.activeVariantId;

  if (!blueprintId) {
    return;
  }

  if (!workspacesStore.activeBucket?.value && variantId) {
    isLoading.value = true;

    try {
      await variantsStore.getBucketById(variantId);
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
});
</script>
