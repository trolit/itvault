<template>
  <n-card size="medium">
    <n-thing :title="item.name">
      <template #header-extra>
        <pin-manager
          :pinned-at="item.pinnedAt"
          :is-loading="workspacesStore.pinStatusUpdateItemId === item.id"
          @pin="workspacesStore.pin(item.id)"
          @unpin="workspacesStore.unpin(item.id)"
        />
      </template>

      <div>
        <n-space size="small" :style="{ marginBottom: '15px' }">
          <n-tag
            size="small"
            type="success"
            :key="`tag-${index}`"
            v-for="(tag, index) in item.tags"
          >
            {{ tag }}
          </n-tag>
        </n-space>

        <div>
          <n-text :depth="3">
            {{ item.description }}
          </n-text>
        </div>

        <n-space :style="{ marginTop: '20px' }" justify="end">
          <n-button secondary type="success" @click="$emit('open')">
            Go to
          </n-button>

          <require-permission :permission="Permission.UpdateWorkspace">
            <n-button tertiary @click="$emit('toggle-edit-drawer')">
              Edit information
            </n-button>
          </require-permission>
        </n-space>
      </div>
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import { NButton, NSpace, NTag, NCard, NText, NThing } from "naive-ui";

import { useWorkspacesStore } from "@/store/workspaces";
import PinManager from "@/components/common/PinManager.vue";
import { Permission } from "@shared/types/enums/Permission";
import type { IWorkspaceDTO } from "@shared/types/DTOs/Workspace";
import RequirePermission from "@/components/common/RequirePermission.vue";

interface IProps {
  item: IWorkspaceDTO;
}

defineProps<IProps>();

defineEmits(["open", "toggle-edit-drawer"]);

const workspacesStore = useWorkspacesStore();
</script>
