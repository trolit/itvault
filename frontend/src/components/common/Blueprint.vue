<template>
  <div class="blueprint">
    <div class="content">
      <div class="thumbnail" :style="{ backgroundColor: blueprint.color }" />

      <n-tag size="tiny">{{ blueprint.color }}</n-tag>
    </div>

    <small>{{ blueprint.name }}</small>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

defineProps({
  blueprint: {
    type: Object as PropType<IBlueprintDto>,
    required: true,
  },
});
</script>
