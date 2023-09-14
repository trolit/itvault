<template>
  <n-thing>
    <template #avatar>
      <n-avatar>
        <n-icon :component="SizeIcon" />
      </n-avatar>
    </template>

    <template #header> Bundle size </template>

    <template #description>
      {{ bundle.size.value }} ({{ bundle.size.unit }})
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { NThing, NIcon, NAvatar } from "naive-ui";
import { Growth as SizeIcon } from "@vicons/carbon";

import type { IBundleDto } from "@shared/types/dtos/IBundleDto";

defineProps({
  bundle: {
    type: Object as PropType<IBundleDto>,
    required: true,
  },
});
</script>
