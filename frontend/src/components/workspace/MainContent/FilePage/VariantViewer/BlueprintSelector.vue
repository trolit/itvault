<template>
  <n-popselect v-model:value="value" :options="options">
    <n-button size="small">pick blueprint</n-button>
  </n-popselect>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NButton, NPopselect } from "naive-ui";

const value = ref("");
const options = [
  {
    label: "e",
    value: "a",
  },
];
</script>
