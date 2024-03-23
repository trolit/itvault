<template>
  <n-card class="empty-section">
    <div class="content">
      <n-icon :size="70" :component="props.icon" />

      <div class="title">
        {{ props.title }}
      </div>

      <div class="extra">
        <slot name="extra" />
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NIcon, NCard } from "naive-ui";
import { Information as DefaultIcon } from "@vicons/carbon";

const props = defineProps({
  icon: {
    type: Object,
    required: false,
    default: DefaultIcon,
  },

  title: {
    type: String,
    required: true,
  },
});
</script>
