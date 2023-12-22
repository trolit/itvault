<template>
  <n-modal
    :show="isVisible"
    segmented
    title="Are you sure?"
    preset="card"
    :bordered="true"
    :closable="!isLoading"
    :close-on-esc="false"
    :mask-closable="false"
    :style="{ width: '600px' }"
    @close="close"
  >
    <div class="text-center">{{ text }}</div>

    <template #footer>
      <n-space justify="space-between">
        <n-button @click="close" :disabled="isLoading"> Cancel </n-button>

        <n-button type="warning" :loading="isLoading" @click="$emit('confirm')">
          Confirm
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NSpace, NButton } from "naive-ui";

interface IProps {
  text: string;

  isVisible: boolean;

  isLoading: boolean;
}

interface IEmits {
  (event: "confirm"): void;

  (event: "update:is-visible", state: boolean): void;
}

defineProps<IProps>();
const emits = defineEmits<IEmits>();

function close() {
  emits("update:is-visible", false);
}
</script>
