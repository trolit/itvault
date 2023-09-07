<template>
  <ref-card :icon="UserProfileIcon" :title="email">
    <template #content>
      <n-space vertical size="large">
        <n-descriptions
          label-placement="top"
          class="text-center"
          label-align="center"
          :label-style="{
            paddingBottom: '10px',
          }"
        >
          <n-descriptions-item label="Owner">
            {{ fullName }}
          </n-descriptions-item>

          <n-descriptions-item label="Workspaces"> 10 </n-descriptions-item>
          <n-descriptions-item label="Account type">
            <n-tag type="info"> {{ roleName }} </n-tag>
          </n-descriptions-item>
        </n-descriptions>
      </n-space>

      <n-divider dashed />

      <h4>Permissions</h4>

      <n-scrollbar trigger="none">
        <n-space>
          <n-card v-for="(group, index) in groupedPermissions" :key="index">
            <n-grid x-gap="12" :cols="3" class="permissions-grid">
              <n-grid-item class="label">
                <div>
                  {{ group.name }}

                  <div>
                    <small>total = {{ group.total }}</small>
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
  </ref-card>
</template>

<script setup lang="ts">
import {
  NTag,
  NSpace,
  NCard,
  NGrid,
  NEmpty,
  NGridItem,
  NDivider,
  NScrollbar,
  NDescriptions,
  NDescriptionsItem,
} from "naive-ui";
import { computed } from "vue";
import { UserProfile as UserProfileIcon } from "@vicons/carbon";

import RefCard from "./RefCard.vue";
import { useAuthStore } from "@/store/auth";

const {
  profile: { email, roleName, permissions, fullName },
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
