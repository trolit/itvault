<template>
  <n-tag size="small" :type="status.type" class="bundle-status">
    <n-icon :size="30" :component="status.icon" />

    {{ status.text }}
  </n-tag>
</template>

<script setup lang="ts">
import {
  Document as ReadyStatusIcon,
  Cube as BuildingStatusIcon,
  DataError as ErrorStatusIcon,
  Unknown as UnknownStatusIcon,
  ConnectionReceive as EnqueuedStatusIcon,
} from "@vicons/carbon";
import { NTag, NIcon } from "naive-ui";
import { computed, type Component, type PropType } from "vue";

import type { NaiveType } from "@/types/NaiveType";
import { BundleStatus } from "@shared/types/enums/BundleStatus";

const props = defineProps({
  value: {
    type: String as PropType<BundleStatus>,
    required: true,
  },
});

const statuses: {
  icon: Component;
  status: BundleStatus | undefined;
  text: string;
  type: NaiveType;
}[] = [
  {
    icon: UnknownStatusIcon,
    text: "unknown",
    status: undefined,
    type: "default",
  },

  {
    status: BundleStatus.Enqueued,
    icon: EnqueuedStatusIcon,
    text: "enqueued",
    type: "info",
  },

  {
    status: BundleStatus.Building,
    icon: BuildingStatusIcon,
    text: "building",
    type: "warning",
  },

  {
    status: BundleStatus.Failed,
    icon: ErrorStatusIcon,
    text: "error",
    type: "error",
  },

  {
    status: BundleStatus.Ready,
    icon: ReadyStatusIcon,
    text: "ready",
    type: "success",
  },
];

const status = computed(() => {
  return statuses.find(({ status }) => status === props.value) || statuses[0];
});
</script>
