<template>
  <n-drawer
    :show="props.isActive"
    :width="502"
    placement="right"
    :show-mask="false"
    :mask-closable="false"
    @update:show="$emit('update:is-active', false)"
  >
    <n-drawer-content title="Stoner" closable>
      This is add-edit-blueprint drawer
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { NDrawer, NDrawerContent } from "naive-ui";

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["update:is-active"]);
</script>
