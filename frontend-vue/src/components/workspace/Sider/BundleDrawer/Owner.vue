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
      {{ dateService.format(bundle.createdAt, "DD-MM-YYYY") }}
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import { NThing, NIcon, NAvatar } from "naive-ui";
import { UserAvatar as UserAvatarIcon } from "@vicons/carbon";

import { useAuthStore } from "@/store/auth";
import { useDateService } from "@/services/useDateService";
import type { IBundleDTO } from "@shared/types/DTOs/Bundle";

const props = defineProps({
  bundle: {
    type: Object as PropType<IBundleDTO>,
    required: true,
  },
});

const authStore = useAuthStore();
const dateService = useDateService();

const fullName = computed(() => {
  if (props.bundle.createdBy) {
    return props.bundle.createdBy.fullName;
  }

  return authStore.profile.fullName;
});
</script>
