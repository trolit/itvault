<template>
  <n-thing v-if="bundle.createdBy">
    <template #avatar>
      <n-avatar>
        <n-icon :component="UserAvatarIcon" />
      </n-avatar>
    </template>

    <template #header> {{ bundle.createdBy.fullName }} </template>

    <template #description>
      created this bundle on
      {{ formatDate(bundle.createdAt, "DD-MM-YYYY") }}
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { NThing, NIcon, NAvatar } from "naive-ui";
import { UserAvatar as UserAvatarIcon } from "@vicons/carbon";

import formatDate from "@/helpers/dayjs/formatDate";
import type { PropType } from "vue";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";

defineProps({
  bundle: {
    type: Object as PropType<IBundleDto>,
    required: true,
  },
});
</script>
