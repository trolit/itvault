<template>
  <n-thing>
    <div class="tab-toolbar">
      <n-button type="warning" size="small" @click="$emit('reset')">
        <n-icon :component="ResetIcon" :size="20" />
      </n-button>

      <n-input clearable show-count :placeholder="inputPlaceholder">
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
  Reset as ResetIcon,
  Search as SearchIcon,
} from "@vicons/carbon";
import { NIcon, NButton, NThing, NInput } from "naive-ui";

import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";

defineProps({
  inputPlaceholder: {
    type: String,
    required: true,
  },
});

defineEmits(["reset", "add-item"]);
</script>
