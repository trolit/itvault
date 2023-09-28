<template>
  <n-popselect
    cancelable
    :value="data.id"
    :options="data.options"
    :render-label="renderLabel"
    :disabled="isBucketModified"
    @update:value="workspacesStore.setVariantTabActiveBlueprint($event)"
  >
    <n-button
      size="small"
      :loading="isFetchingBucket"
      :disabled="isBucketModified"
    >
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
        <n-auto-complete
          blur-after-select
          :value="blueprintInput"
          placeholder="Type name"
          :options="blueprintOptions"
          :loading="isFetchingBlueprints"
          :disabled="isFetchingBlueprints"
          @select="onBlueprintSelect"
          @update:value="onBlueprintInputChange"
        />

        <!-- @TODO disable add button when blueprint is already included-->
        <n-button
          size="small"
          :disabled="!selectedBlueprintId || isBlueprintAlreadyIncluded"
          @click="onBlueprintAdd"
        >
          add
        </n-button>
      </div>

      <n-text v-if="isBlueprintAlreadyIncluded" type="warning">
        <small>This blueprint is already included.</small>
      </n-text>
    </template>
  </n-popselect>
</template>

<script setup lang="ts">
import {
  NTag,
  NText,
  NButton,
  NPopselect,
  useMessage,
  NAutoComplete,
} from "naive-ui";
import { h, ref, watch, type Ref } from "vue";
import type { SelectBaseOption } from "naive-ui/es/select/src/interface";

import { useVariantsStore } from "@/store/variants";
import { useBlueprintsStore } from "@/store/blueprints";
import { useWorkspacesStore } from "@/store/workspaces";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";
import { defineComputed } from "@/helpers/defineComputed";

const message = useMessage();
const variantsStore = useVariantsStore();
const blueprintsStore = useBlueprintsStore();
const workspacesStore = useWorkspacesStore();

defineProps({
  isBucketModified: {
    type: Boolean,
    required: true,
  },
});

const blueprintInput = ref("");
const selectedBlueprintId = ref(0);
const isFetchingBucket = ref(false);
const isFetchingBlueprints = ref(false);
const blueprintSearchTimeoutId = ref(0);
const blueprints: Ref<IBlueprintDto[]> = ref([]);

const { blueprintOptions, isBlueprintAlreadyIncluded, data } = defineComputed({
  blueprintOptions() {
    return blueprints.value.map(({ id, name }) => ({
      label: name,
      value: id.toString(),
    }));
  },

  isBlueprintAlreadyIncluded() {
    return (
      !!selectedBlueprintId.value &&
      data.value.options.some(
        option => option.value === selectedBlueprintId.value
      )
    );
  },

  data() {
    const variantTab = workspacesStore.activeVariantTab;

    if (!variantTab) {
      return { id: 0, options: [] };
    }

    const { activeBlueprintId: id, blueprints, buckets } = variantTab;

    return {
      id,
      name: workspacesStore.activeBlueprint?.name,
      options: blueprints.map(({ id, name, color }) => ({
        label: name,
        value: id,
        color: color,
        isNotSaved: !!buckets.find(
          bucket => bucket.blueprintId === id && bucket.id === 0
        ),
      })),
    };
  },
});

function renderLabel(
  option: SelectBaseOption & { color: string; isNotSaved: boolean }
) {
  const { label, color, isNotSaved } = option;

  const content = [
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
  ];

  if (isNotSaved) {
    content.push(h(NText, { depth: 3 }, { default: () => "(Not saved)" }));
  }

  return h(
    "div",
    { class: "flex align-items-center", style: { columnGap: "5px" } },
    content
  );
}

watch(data, async () => {
  const blueprintId = data.value.id;
  const variantId = workspacesStore.activeFileTab?.activeVariantId;

  if (!blueprintId) {
    return;
  }

  if (!workspacesStore.activeBucket?.value && variantId) {
    isFetchingBucket.value = true;

    try {
      await variantsStore.getBucketById(variantId);
    } catch (error) {
      console.log(error);
    } finally {
      isFetchingBucket.value = false;
    }
  }
});

function onBlueprintInputChange(input: string) {
  if (blueprintOptions.value.some(({ label }) => label === input)) {
    return;
  }

  blueprintInput.value = input;

  if (!input) {
    selectedBlueprintId.value = 0;

    return;
  }

  if (blueprintSearchTimeoutId.value) {
    clearTimeout(blueprintSearchTimeoutId.value);
  }

  blueprintSearchTimeoutId.value = setTimeout(async () => {
    blueprints.value = [];

    isFetchingBlueprints.value = true;

    try {
      const { result, total } = await blueprintsStore.getAll({
        page: 1,
        perPage: 5,
        name: input,
      });

      blueprints.value = total ? result : [];

      if (!total) {
        message.info(`No blueprints found with keyword /${input}/`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      isFetchingBlueprints.value = false;
    }
  }, 250);
}

function onBlueprintSelect(value: string | number) {
  if (typeof value !== "string") {
    return;
  }

  const option = blueprintOptions.value.find(option => option.value === value);

  if (option && option.label) {
    blueprintInput.value = option.label;

    selectedBlueprintId.value = parseInt(value);
  }
}

function onBlueprintAdd() {
  const blueprint = blueprints.value.find(
    ({ id }) => id === selectedBlueprintId.value
  );

  if (!blueprint) {
    return;
  }

  workspacesStore.initializeBlueprintWithBucket(blueprint);

  workspacesStore.setVariantTabActiveBlueprint(blueprint.id);

  if (!workspacesStore.isActiveVariantTabInWriteMode) {
    workspacesStore.setVariantTabWriteMode(true);
  }

  blueprintInput.value = "";
  selectedBlueprintId.value = 0;
}
</script>
