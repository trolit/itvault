<template>
  <n-popselect
    cancelable
    :value="data.id"
    :options="data.options"
    :render-label="renderLabel"
    :disabled="isBucketModified"
    @update:value="variantsStore.setActiveTabBlueprint($event)"
  >
    <n-button
      size="small"
      :loading="isFetchingBucket"
      :disabled="isBucketModified"
    >
      {{ data.name || "pick blueprint" }}
    </n-button>

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
          clearable
          blur-after-select
          :value="blueprintInput"
          placeholder="Type name"
          :options="blueprintOptions"
          :loading="isFetchingBlueprints"
          :disabled="isFetchingBlueprints"
          @select="onBlueprintSelect"
          @update:value="onBlueprintInputChange"
        />

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
import { h, ref, type Ref } from "vue";
import type { SelectBaseOption } from "naive-ui/es/select/src/interface";
import { NTag, NText, NButton, NPopselect, NAutoComplete } from "naive-ui";

import { useFilesStore } from "@/store/files";
import { useBucketsStore } from "@/store/buckets";
import { useGeneralStore } from "@/store/general";
import { useVariantsStore } from "@/store/variants";
import { useBlueprintsStore } from "@/store/blueprints";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";

const filesStore = useFilesStore();
const bucketsStore = useBucketsStore();
const generalStore = useGeneralStore();
const variantsStore = useVariantsStore();
const blueprintsStore = useBlueprintsStore();

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
const blueprints: Ref<IBlueprintDTO[]> = ref([]);

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
    const variantTab = variantsStore.activeTab;

    if (!variantTab) {
      return { id: 0, options: [] };
    }

    const { activeBlueprintId: id, blueprints, buckets } = variantTab;

    return {
      id,
      name: blueprintsStore.activeItem?.name,
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

defineWatchers({
  data: {
    source: data,
    handler: async () => {
      const blueprintId = data.value.id;
      const variantId = filesStore.activeTab?.activeVariantId;

      if (!blueprintId) {
        return;
      }

      if (!bucketsStore.activeItem?.value && variantId) {
        isFetchingBucket.value = true;

        try {
          await variantsStore.getBucketById(variantId);
        } catch (error) {
          console.log(error);
        } finally {
          isFetchingBucket.value = false;
        }
      }
    },
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
        generalStore.messageProvider.info(
          `No blueprints found with keyword /${input}/`
        );
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

  variantsStore.initializeActiveTabBlueprintWithBucket(blueprint);

  variantsStore.setActiveTabBlueprint(blueprint.id);

  if (!variantsStore.isActiveTabInWriteMode) {
    variantsStore.setActiveTabWriteMode(true);
  }

  blueprintInput.value = "";
  selectedBlueprintId.value = 0;
}
</script>
