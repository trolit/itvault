<template>
  <template v-if="isEnabled() || props.or">
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

  or: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const authStore = useAuthStore();

function isEnabled() {
  return isPermissionEnabled(
    props.permission as Permission,
    authStore.profile.permissions
  );
}
</script>
