<template>
  <n-grid :cols="1" class="bottom-panel">
    <n-grid-item>
      <n-button strong secondary type="primary"> New workspace </n-button>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { NButton, NGrid, NGridItem } from "naive-ui";
</script>
