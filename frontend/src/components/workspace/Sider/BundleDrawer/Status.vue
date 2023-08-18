<template>
  <n-thing>
    <template #avatar>
      <n-avatar>
        <n-icon :component="InfoIcon" />
      </n-avatar>
    </template>

    <template #header> Status </template>

    <template #description>
      <span v-if="bundle.expiresAt === BundleExpire.Never">
        This bundle never expires.
      </span>

      Bundle expires at
      <n-tag type="warning" :bordered="false" size="small">
        {{ formatDate(bundle.expiresAt, "DD-MM-YYYY HH:mm") }}
      </n-tag>
      <div>
        (in
        <n-countdown :duration="getDifferenceToNow(bundle.expiresAt)" />
        hours)

        <n-progress
          type="line"
          status="warning"
          :percentage="percentage"
          :show-indicator="false"
        />
      </div>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { computed, type PropType } from "vue";
import { Information as InfoIcon } from "@vicons/carbon";
import { NThing, NIcon, NTag, NAvatar, NProgress, NCountdown } from "naive-ui";

import formatDate from "@/helpers/dayjs/formatDate";
import { BundleExpire } from "@shared/types/enums/BundleExpire";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";
import getDifferenceToNow from "@/helpers/dayjs/getDifferenceToNow";

const props = defineProps({
  bundle: {
    type: Object as PropType<IBundleDto>,
    required: true,
  },
});

const now = dayjs();

const expiresAt = computed(() => props.bundle.expiresAt);

const parsedExpiresAt = dayjs(expiresAt.value);

let percentage = 100 - Math.ceil(now.valueOf() / parsedExpiresAt.valueOf());
</script>
