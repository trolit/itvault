<template>
  <n-thing>
    <template #avatar>
      <n-avatar>
        <n-icon :component="UserAvatarIcon" />
      </n-avatar>
    </template>

    <template #header> {{ fullName }} </template>

    <template #description>
      created this bundle on
      {{ formatDate(bundle.createdAt, "DD-MM-YYYY") }}
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import { NThing, NIcon, NAvatar } from "naive-ui";
import { UserAvatar as UserAvatarIcon } from "@vicons/carbon";

import { useAuthStore } from "@/store/auth";
import formatDate from "@/helpers/dayjs/formatDate";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";

const props = defineProps({
  bundle: {
    type: Object as PropType<IBundleDto>,
    required: true,
  },
});

const authStore = useAuthStore();

const fullName = computed(() => {
  if (props.bundle.createdBy) {
    return props.bundle.createdBy.fullName;
  }

  return authStore.profile.fullName;
});
</script>
