<template>
  <div class="loading-page">
    <div class="wrapper">
      <div v-if="!error" class="state-loading">
        <loading-section spin-size="large" />

        <div>Loading page...</div>
      </div>

      <div v-if="error" class="state-error">
        <n-alert title="Failed to load page" type="error">
          We were unable to load page

          <n-divider />

          <div :style="{ marginTop: '20px' }">
            {{ error.response }}
          </div>
        </n-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NDivider } from "naive-ui";
import type { AxiosError } from "axios";

import LoadingSection from "@/components/common/LoadingSection.vue";

interface IProps {
  error: AxiosError | null;
}

// @TODO allow to pass response codes and show message depending on status code
defineProps<IProps>();
</script>
