<template>
  <n-thing>
    <div class="tab-toolbar">
      <n-button
        type="warning"
        size="small"
        :disabled="isLoading"
        @click="$emit('reload')"
      >
        <n-icon :component="ReloadIcon" :size="20" />
      </n-button>

      <n-input
        clearable
        show-count
        :disabled="isLoading"
        :placeholder="inputPlaceholder"
      >
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <require-permission :permission="Permission.CreateBlueprint">
        <n-button size="small" @click="$emit('add-item')">
          <n-icon :component="AddIcon" :size="25" />
        </n-button>
      </require-permission>
    </div>
  </n-thing>
</template>

<script setup lang="ts">
import {
  Add as AddIcon,
  Reset as ReloadIcon,
  Search as SearchIcon,
} from "@vicons/carbon";
import { NIcon, NButton, NThing, NInput } from "naive-ui";

import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";

defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },

  inputPlaceholder: {
    type: String,
    required: true,
  },
});

defineEmits(["reload", "add-item"]);
</script>
