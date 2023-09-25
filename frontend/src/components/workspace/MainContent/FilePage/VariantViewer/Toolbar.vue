<template>
  <n-card class="toolbar" :bordered="false">
    <n-space align="center">
      <n-button quaternary size="tiny"> Help </n-button>

      <n-divider vertical />

      <n-switch
        :value="workspacesStore.isActiveVariantTabInWriteMode"
        :disabled="isBucketModified"
        :round="false"
        @update-value="workspacesStore.setVariantTabWriteMode"
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
  useMessage,
  NPopconfirm,
} from "naive-ui";
import { ref } from "vue";

import { useBucketsStore } from "@/store/buckets";
import { useWorkspacesStore } from "@/store/workspaces";
import BlueprintPopSelect from "./BlueprintPopSelect.vue";

const message = useMessage();
const bucketsStore = useBucketsStore();
const workspacesStore = useWorkspacesStore();

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

    message.success(
      `Changes saved! Please note that these changes won't be applied to bundles that were already generated.`
    );
  } catch (error) {
    console.log(error);
  } finally {
    isSavingChanges.value = false;
  }
}
</script>
