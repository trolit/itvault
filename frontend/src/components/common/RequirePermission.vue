<template>
  <template v-if="isEnabled()">
    <slot></slot>
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import type { Permission } from "@shared/types/enums/Permission";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

const props = defineProps({
  permission: {
    type: String,
    required: true,
  },
});

const {
  profile: { permissions },
} = useAuthStore();

function isEnabled() {
  return isPermissionEnabled(props.permission as Permission, permissions);
}
</script>
