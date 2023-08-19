<template>
  <div class="bundle-blueprint">
    <n-card :title="value.name">
      <template #header>
        <div class="thumbnail" :style="{ backgroundColor: value.color }" />

        <n-tag>{{ value.color }}</n-tag>
      </template>

      <template #header-extra>
        {{ value.name }}
      </template>

      <n-button text :loading="false" class="load-files-button">
        <template #icon>
          <n-icon :size="20" :component="PreviewIcon" />
        </template>

        load files
      </n-button>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { Magnify as PreviewIcon } from "@vicons/carbon";
import { NCard, NTag, NButton, NIcon } from "naive-ui";
import type { PropType } from "vue";

import type { IBundleBlueprintDto } from "@shared/types/dtos/IBundleBlueprintDto";

defineProps({
  value: {
    type: Object as PropType<IBundleBlueprintDto>,
    required: true,
  },
});
</script>
