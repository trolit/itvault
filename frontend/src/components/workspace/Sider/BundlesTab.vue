<template>
  <div class="bundles-tab">
    <div class="header">
      <n-button type="info" size="small" dashed>
        <n-icon :component="ResetIcon" :size="20" />
      </n-button>

      <!-- @TODO create common component -->
      <n-input clearable show-count placeholder="Type note or status">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <n-button type="info" size="small" dashed>
        <n-icon :component="AddIcon" :size="25" />
      </n-button>
    </div>

    <n-scrollbar>
      <div v-if="!isLoading">@TBA</div>

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  Add as AddIcon,
  Reset as ResetIcon,
  Search as SearchIcon,
} from "@vicons/carbon";
import { ref } from "vue";
import { NIcon, NInput, NButton, NSpin, NScrollbar } from "naive-ui";

const isLoading = ref(false);
</script>
