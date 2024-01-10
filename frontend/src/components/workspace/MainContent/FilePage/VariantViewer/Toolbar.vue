<template>
  <n-card class="toolbar" :bordered="false">
    <n-space align="center">
      <n-button secondary size="small"> Help </n-button>

      <n-divider vertical />

      <n-switch
        :value="variantsStore.isActiveTabInWriteMode"
        :disabled="isBucketModified || !blueprintsStore.activeItem"
        :round="false"
        @update-value="variantsStore.setActiveTabWriteMode"
      >
        <template #checked> Write </template>

        <template #unchecked> Read </template>
      </n-switch>

      <n-divider vertical />

      <blueprint-pop-select :is-bucket-modified="isBucketModified" />
    </n-space>

    <n-space v-if="isBucketModified" align="center">
      <small>New changes!</small>

      <n-popconfirm @positive-click="bucketsStore.resetValue">
        <template #trigger>
          <n-button type="warning" ghost size="small"> Discard </n-button>
        </template>

        Are you sure?
      </n-popconfirm>

      <n-popconfirm @positive-click="saveChanges">
        <template #trigger>
          <n-button
            ghost
            size="small"
            type="success"
            :loading="isSavingChanges"
          >
            Save
          </n-button>
        </template>

        Are you sure?
      </n-popconfirm>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NSpace,
  NButton,
  NSwitch,
  NDivider,
  NPopconfirm,
} from "naive-ui";
import { ref } from "vue";

import { useGeneralStore } from "@/store/general";
import { useBucketsStore } from "@/store/buckets";
import { useVariantsStore } from "@/store/variants";
import { useBlueprintsStore } from "@/store/blueprints";
import BlueprintPopSelect from "./BlueprintPopSelect.vue";

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

const isSavingChanges = ref(false);

async function saveChanges() {
  isSavingChanges.value = true;

  try {
    await bucketsStore.upsert();

    generalStore.messageProvider.success(
      `Changes saved! Please note that these changes won't be applied to bundles that were already generated.`
    );
  } catch (error) {
    console.log(error);
  } finally {
    isSavingChanges.value = false;
  }
}
</script>
