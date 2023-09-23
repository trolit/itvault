<template>
  <n-card class="toolbar" :bordered="false">
    <n-space align="center">
      <n-button quaternary size="tiny"> Help </n-button>

      <n-divider vertical />

      <n-switch :round="false">
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
import BlueprintPopSelect from "./BlueprintPopSelect.vue";

defineProps({
  isBucketModified: {
    type: Boolean,
    required: true,
  },
});

const bucketsStore = useBucketsStore();
</script>
