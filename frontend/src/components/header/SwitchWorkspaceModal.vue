<template>
  <n-modal
    :show="isVisible"
    preset="dialog"
    :closable="true"
    :show-icon="false"
    :mask-closable="false"
    @close="$emit('update:is-visible', false)"
  >
    TBA
  </n-modal>
</template>

<script setup lang="ts">
import { NModal } from "naive-ui";

import type { Emits, Props } from "@/types/CommonModalTypes";

defineProps<Props>();
defineEmits<Emits>();
</script>
