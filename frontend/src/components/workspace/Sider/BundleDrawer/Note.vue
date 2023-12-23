<template>
  <n-thing>
    <template #avatar>
      <n-avatar>
        <n-icon :component="NoteIcon" />
      </n-avatar>
    </template>

    <template #header> Note </template>

    <span v-if="bundle.note">{{ bundle.note }}</span>

    <em v-else>No note provided</em>
  </n-thing>
</template>

<script setup lang="ts">
import { NThing, NIcon, NAvatar } from "naive-ui";
import { StringText as NoteIcon } from "@vicons/carbon";

import type { PropType } from "vue";
import type { IBundleDto } from "@shared/types/dtos/Bundle";

defineProps({
  bundle: {
    type: Object as PropType<IBundleDto>,
    required: true,
  },
});
</script>
