<template>
  <main>
    <n-scrollbar>
      <router-view name="content" />
    </n-scrollbar>
  </main>
</template>

<script setup lang="ts">
import { NScrollbar } from "naive-ui";
</script>
