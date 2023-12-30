<template>
  <n-thing>
    <template #avatar>
      <n-avatar>
        <n-icon :component="InfoIcon" />
      </n-avatar>
    </template>

    <template #header> Status </template>

    <template #description>
      <span v-if="bundle.expire === BundleExpire.Never">
        <n-alert type="info">This bundle never expires.</n-alert>
      </span>

      <span v-else-if="bundle.status !== BundleStatus.Ready">
        <n-alert :type="status.type"> {{ status.text }}</n-alert>
      </span>

      <span v-else>
        expires at

        <n-tag type="info" :bordered="false" size="small">
          {{ dateService.format(expiresAt, "DD-MM-YYYY HH:mm") }}
        </n-tag>

        <div>
          (in
          <n-countdown :duration="dateService.differenceToNow(expiresAt)" />
          hours)

          <n-progress
            type="line"
            status="info"
            :percentage="percentage"
            :show-indicator="true"
          />
        </div>
      </span>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import {
  NTag,
  NIcon,
  NAlert,
  NThing,
  NAvatar,
  NProgress,
  NCountdown,
} from "naive-ui";
import dayjs from "dayjs";
import { computed, type PropType } from "vue";
import { Information as InfoIcon } from "@vicons/carbon";

import type { NaiveStatus } from "@/types/NaiveStatus";
import { useDateService } from "@/services/useDateService";
import type { IBundleDTO } from "@shared/types/DTOs/Bundle";
import { BundleExpire } from "@shared/types/enums/BundleExpire";
import { BundleStatus } from "@shared/types/enums/BundleStatus";

const props = defineProps({
  bundle: {
    type: Object as PropType<IBundleDTO>,
    required: true,
  },
});

const dateService = useDateService();

const expiresAt = computed(() => props.bundle.expiresAt);
const createdAt = computed(() => props.bundle.createdAt);
const status = computed((): { type: NaiveStatus; text: string } => {
  switch (props.bundle.status) {
    case BundleStatus.Enqueued:
      return {
        type: "info",
        text: `Bundle is waiting to become processed...`,
      };
    case BundleStatus.Building:
      return {
        type: "warning",
        text: `Building in progress...`,
      };
    default:
      return {
        type: "error",
        text: "Failed to build bundle 🥺. Try to requeue the operation (if available) or contact itvault team.",
      };
  }
});

const now = dayjs();
const parsedCreatedAt = dayjs(createdAt.value);
const parsedExpiresAt = dayjs(expiresAt.value);

const leftTime = parsedExpiresAt.diff(now, "milliseconds");
const totalTime = parsedExpiresAt.diff(parsedCreatedAt, "milliseconds");
const percentageChange = (leftTime / totalTime) * 100;

const percentage = percentageChange < 0 ? 0 : percentageChange;
</script>
