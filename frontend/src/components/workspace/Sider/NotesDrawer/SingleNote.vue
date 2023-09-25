<template>
  <!-- @TODO show some indicator if message is removed or not (display only if permission is enabled)-->
  <n-thing content-indented class="single-note">
    <template #header>
      <!-- @TODO view user notes -->
      <!-- @TODO extract to common component to use elsewhere -->
      <n-button
        v-if="
          isPermissionEnabled(
            Permission.ViewUserNotes,
            authStore.profile.permissions
          )
        "
        size="small"
        @click="
          emits('toggle-user-comments-modal', createdBy.id, createdBy.fullName)
        "
      >
        {{ createdBy.fullName }}
      </n-button>

      <span v-else>
        {{ createdBy.fullName }}
      </span>
    </template>

    <template #header-extra>
      {{ dateService.fromNow(note.createdAt) }}
    </template>

    <template #description>
      <n-tag size="small" type="info">
        {{ createdBy.role }}
      </n-tag>
    </template>

    <!-- @TODO markdown compiler -->
    <n-card>
      {{ note.value }}
    </n-card>

    <template #footer>
      <!-- @TODO update note -->
      <require-permission
        v-if="authStore.loggedUserId !== createdBy.id"
        :permission="Permission.DeleteAnyNote"
      >
        <n-button type="info" size="small" secondary> Update (any) </n-button>
      </require-permission>

      <n-button
        v-if="authStore.loggedUserId === createdBy.id"
        type="warning"
        size="small"
        secondary
      >
        Update
      </n-button>

      <!-- @TODO delete note -->
      <require-permission
        :permission="Permission.DeleteAnyNote"
        :or="authStore.loggedUserId === createdBy.id"
      >
        <n-button type="error" size="small" secondary>Delete</n-button>
      </require-permission>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { NThing, NTag, NCard, NButton } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import { defineComputed } from "@/helpers/defineComputed";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
import RequirePermission from "@/components/common/RequirePermission.vue";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

const authStore = useAuthStore();
const dateService = useDateService();

const props = defineProps({
  note: {
    type: Object as PropType<INoteDto>,
    required: true,
  },
});

const emits = defineEmits(["toggle-user-comments-modal"]);

const { createdBy } = defineComputed({
  createdBy() {
    return props.note.createdBy;
  },
});
</script>
