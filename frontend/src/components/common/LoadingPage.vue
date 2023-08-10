<template>
  <div class="loading-page">
    <div class="wrapper">
      <div v-if="isLoading" class="state-loading">
        <div>
          <n-spin size="large" />
        </div>

        <div>Loading page...</div>
      </div>

      <div v-if="!isLoading && isFailed" class="state-error">
        <n-alert title="Failed to load page" type="error">
          We were unable to fetch primary data. Please try to reload page or
          make sure that requested resource exists.
        </n-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NSpin, NAlert } from "naive-ui";

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },

  isFailed: {
    type: Boolean,
    required: true,
  },
});
</script>
