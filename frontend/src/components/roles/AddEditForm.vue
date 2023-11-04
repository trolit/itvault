<template>
  <div>{{ roleTab.role.name }}</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

import type { RoleTab } from "@/types/RoleTab";

defineProps({
  roleTab: {
    type: Object as PropType<RoleTab>,
    required: true,
  },
});
</script>
