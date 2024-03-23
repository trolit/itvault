<template>
  <n-modal
    :show="isVisible"
    segmented
    title="Permissions"
    preset="card"
    :closable="true"
    :mask-closable="false"
    :style="{ width: '600px' }"
    @close="$emit('update:is-visible', false)"
  >
    <n-scrollbar :style="{ maxHeight: '70vh' }" trigger="none">
      <div
        v-for="(group, index) in groupedPermissions"
        :key="index"
        :style="{ marginRight: '20px' }"
      >
        <n-row>
          <n-col :span="6">
            <div>
              <n-text
                :style="{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                }"
              >
                {{ group.name }}</n-text
              >

              <div>
                <small>
                  <n-text depth="3"> Total = {{ group.total }} </n-text>
                </small>
              </div>

              <div>
                <small>
                  <n-text depth="3">
                    Enabled = {{ group.enabled.length }}
                  </n-text>
                </small>
              </div>

              <div>
                <small>
                  <n-text depth="3">
                    Disabled = {{ group.disabled.length }}
                  </n-text>
                </small>
              </div>
            </div>
          </n-col>

          <n-col :span="18">
            <n-space>
              <n-tag
                v-for="({ name }, permissionIndex) in group.enabled"
                size="small"
                type="success"
                :key="`${group}-${index}-permission-${permissionIndex}`"
              >
                {{ name }}
              </n-tag>

              <n-tag
                v-for="({ name }, permissionIndex) in group.disabled"
                size="small"
                type="error"
                :key="`${group}-${index}-permission-${permissionIndex}`"
              >
                {{ name }}
              </n-tag>
            </n-space>
          </n-col>
        </n-row>

        <n-divider v-if="index !== groupedPermissions.length - 1" />
      </div>
    </n-scrollbar>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NCol,
  NTag,
  NRow,
  NText,
  NModal,
  NSpace,
  NDivider,
  NScrollbar,
} from "naive-ui";
import { computed } from "vue";

import { useAuthStore } from "@/store/auth";
import type { Emits, Props } from "@/types/CommonModalTypes";

defineProps<Props>();
defineEmits<Emits>();

const {
  profile: { permissions },
} = useAuthStore();

const groupedPermissions = computed(() => {
  const groups = [...new Set(permissions.map(({ group }) => group))].sort();

  return groups.map(group => {
    const groupPermissions = permissions.filter(
      permission => permission.group === group
    );

    return {
      name: group,
      total: groupPermissions.length,
      enabled: groupPermissions.filter(permission => permission.enabled),
      disabled: groupPermissions.filter(permission => !permission.enabled),
    };
  });
});
</script>
