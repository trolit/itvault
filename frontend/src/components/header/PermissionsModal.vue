<template>
  <n-modal
    :show="isVisible"
    segmented
    title="Your permissions:"
    preset="card"
    :bordered="true"
    :closable="true"
    :close-on-esc="true"
    :mask-closable="false"
    :style="{ width: '600px' }"
    @close="$emit('update:is-visible', false)"
  >
  </n-modal>
</template>

<script setup lang="ts">
import { NModal } from "naive-ui";

interface IProps {
  isVisible: boolean;
}

defineProps<IProps>();

defineEmits(["update:is-visible"]);
</script>
