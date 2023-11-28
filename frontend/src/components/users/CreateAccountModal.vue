<template>
  <n-modal
    :show="isVisible"
    segmented
    title="Create account"
    preset="card"
    :bordered="true"
    :closable="!isLoading"
    :close-on-esc="false"
    :mask-closable="false"
    :style="{ width: '600px' }"
    @close="close"
  >
    TBA
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface IProps {
  isVisible: boolean;
}

defineProps<IProps>();

const emits = defineEmits(["update:is-visible"]);

const isLoading = ref(false);

function close() {
  emits("update:is-visible", false);
}
</script>
