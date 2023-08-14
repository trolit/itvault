<template>
  <n-modal :title="title" preset="dialog">
    <div>NOTES - TBA</div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NModal } from "naive-ui";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },

  fullName: {
    type: String,
    required: true,
  },
});

const title = computed(() => `${props.fullName}'s notes`);
</script>
