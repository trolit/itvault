<template>
  <div>
    <n-element
      :style="{ display: 'flex', alignItems: 'center', columnGap: '20px' }"
    >
      <span>Theme</span>

      <theme-selector>
        <n-button strong secondary>
          {{ generalStore.theme }}
        </n-button>
      </theme-selector>
    </n-element>
  </div>
</template>

<script setup lang="ts">
import { NElement, NButton } from "naive-ui";

import ThemeSelector from "@/components/common/ThemeSelector.vue";
import { useGeneralStore } from "@/store/general";

const generalStore = useGeneralStore();
</script>
