<template>
  <n-card class="toolbar" :bordered="false">
    <n-space align="center">
      <n-button quaternary size="tiny"> Help </n-button>

      <n-divider vertical />

      <n-switch
        :value="isWriteModeActive"
        :round="false"
        @update-value="workspacesStore.setVariantTabWriteMode"
      >
        <template #checked> Write </template>

        <template #unchecked> Read </template>
      </n-switch>

      <n-divider vertical />

      <blueprint-pop-select />
    </n-space>

    <n-space v-if="isBucketModified" align="center">
      <small>New changes!</small>

      <n-popconfirm @positive-click="bucketsStore.resetValue">
        <template #trigger>
          <n-button type="warning" ghost size="small"> Discard </n-button>
        </template>

        Are you sure?
      </n-popconfirm>

      <n-popconfirm>
        <template #trigger>
          <n-button type="success" ghost size="small"> Save </n-button>
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

import { useBucketsStore } from "@/store/buckets";
import { useWorkspacesStore } from "@/store/workspaces";
import BlueprintPopSelect from "./BlueprintPopSelect.vue";
import { defineComputed } from "@/helpers/defineComputed";

const bucketsStore = useBucketsStore();
const workspacesStore = useWorkspacesStore();

defineProps({
  isBucketModified: {
    type: Boolean,
    required: true,
  },
});

const { isWriteModeActive } = defineComputed({
  isWriteModeActive() {
    return workspacesStore.activeVariantTab?.isWriteModeActive || false;
  },
});
</script>
