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
      <actions-dropdown
        v-if="isNoteOwner || canDeleteAnyNote || canUpdateAnyNote"
        :is-note-owner="isNoteOwner"
        :can-delete-any-note="canDeleteAnyNote"
        :can-update-any-note="canUpdateAnyNote"
      />
    </template>

    <template #description>
      <n-tag size="small" type="info">
        {{ createdBy.role }}
      </n-tag>

      <div>
        <n-text depth="3">
          <small>{{ dateService.fromNow(note.createdAt) }}</small>
        </n-text>
      </div>
    </template>

    <!-- @TODO markdown compiler -->
    <n-card>
      {{ note.value }}
    </n-card>
  </n-thing>
</template>

<script setup lang="ts">
import { toRefs, type PropType } from "vue";
import { NThing, NTag, NCard, NButton, NText } from "naive-ui";

import { useAuthStore } from "@/store/auth";
import ActionsDropdown from "./ActionsDropdown.vue";
import { defineComputed } from "@/helpers/defineComputed";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
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

const { note } = toRefs(props);

const { createdBy, isNoteOwner, canUpdateAnyNote, canDeleteAnyNote } =
  defineComputed({
    createdBy() {
      return props.note.createdBy;
    },

    isNoteOwner() {
      return authStore.loggedUserId === createdBy.value.id;
    },

    canUpdateAnyNote() {
      return authStore.hasPermission(Permission.UpdateAnyNote);
    },

    canDeleteAnyNote() {
      return authStore.hasPermission(Permission.DeleteAnyNote);
    },
  });
</script>
