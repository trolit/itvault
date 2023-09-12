<template>
  <content-card :icon="PermissionsIcon" title="Your permissions">
    <template #content>
      <n-scrollbar trigger="none">
        <n-space>
          <n-card v-for="(group, index) in groupedPermissions" :key="index">
            <n-grid x-gap="12" :cols="3" class="permissions-grid">
              <n-grid-item class="label">
                <div>
                  <n-text>{{ group.name }}</n-text>

                  <div>
                    <small>
                      <n-text depth="3"> total = {{ group.total }} </n-text>
                    </small>
                  </div>
                </div>
              </n-grid-item>

              <n-grid-item>
                <div>Enabled ({{ group.enabled.length }})</div>

                <n-space v-if="group.enabled.length">
                  <n-tag
                    v-for="({ name }, permissionIndex) in group.enabled"
                    size="small"
                    type="success"
                    :key="`${group}-${index}-permission-${permissionIndex}`"
                  >
                    {{ name }}
                  </n-tag>
                </n-space>

                <div v-else class="empty-wrapper">
                  <n-empty size="small" description="Empty" />
                </div>
              </n-grid-item>

              <n-grid-item>
                <div>Disabled ({{ group.disabled.length }})</div>

                <n-space v-if="group.disabled.length">
                  <n-tag
                    v-for="({ name }, permissionIndex) in group.disabled"
                    size="small"
                    type="error"
                    :key="`${group}-${index}-permission-${permissionIndex}`"
                  >
                    {{ name }}
                  </n-tag>
                </n-space>

                <div v-else class="empty-wrapper">
                  <n-empty size="small" description="Empty" />
                </div>
              </n-grid-item>
            </n-grid>
          </n-card>
        </n-space>
      </n-scrollbar>
    </template>
  </content-card>
</template>

<script setup lang="ts">
import {
  NTag,
  NText,
  NCard,
  NGrid,
  NEmpty,
  NSpace,
  NGridItem,
  NScrollbar,
} from "naive-ui";
import { computed } from "vue";
import { ValueVariable as PermissionsIcon } from "@vicons/carbon";

import ContentCard from "./ContentCard.vue";
import { useAuthStore } from "@/store/auth";

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
