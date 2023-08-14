<template>
  <!-- @TODO show some indicator if message is removed or not (display only if permission is enabled)-->
  <n-thing content-indented class="single-note">
    <template #header>
      <!-- @TODO view user notes request -->
      <component
        :is="
          isPermissionEnabled(
            Permission.ViewUserNotes,
            authStore.profile.permissions
          )
            ? NButton
            : 'span'
        "
      >
        {{ note.createdBy.fullName }}
      </component>
    </template>

    <template #header-extra>
      {{ formatDate(note.createdAt, "YYYY-MM-DD HH:mm") }}
    </template>

    <template #description>
      <n-tag size="small" type="info">
        {{ note.createdBy.role }}
      </n-tag>
    </template>

    <!-- @TODO markdown compiler -->
    <n-card>
      {{ note.value }}
    </n-card>

    <template #footer>
      <!-- @TODO update note -->
      <require-permission
        :permission="Permission.DeleteAnyNote"
        :or="loggedUserId === note.createdBy.id"
      >
        <n-button type="warning" size="small" secondary>Update</n-button>
      </require-permission>

      <!-- @TODO delete note -->
      <require-permission
        :permission="Permission.DeleteAnyNote"
        :or="loggedUserId === note.createdBy.id"
      >
        <n-button type="error" size="small" secondary>Delete</n-button>
      </require-permission>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";
import { NThing, NTag, NCard, NButton } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import formatDate from "@/helpers/dayjs/formatDate";
import { Permission } from "@shared/types/enums/Permission";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
import RequirePermission from "@/components/common/RequirePermission.vue";
import { isPermissionEnabled } from "@shared/helpers/isPermissionEnabled";

const props = defineProps({
  note: {
    type: Object as PropType<INoteDto>,
    required: true,
  },
});

const authStore = useAuthStore();

const note = computed(() => {
  return props.note;
});

const loggedUserId = computed(authStore.loggedUserId);
</script>
