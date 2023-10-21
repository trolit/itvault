<template>
  <n-switch>
    <template #checked> {{ checkedText }} </template>

    <template #unchecked> {{ uncheckedText }} </template>
  </n-switch>
</template>

<script setup lang="ts">
import { NSwitch } from "naive-ui";

interface IProps {
  checkedText: string;

  uncheckedText: string;
}

defineProps<IProps>();
</script>
