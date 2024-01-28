<template>
  <n-thing class="single-note" :style="{ opacity: note.isDeleted ? 0.4 : 1 }">
    <n-card size="small" embedded>
      <template #header-extra> #header-extra </template>

      <div v-html="markdown.render(note.value)" class="markdown-render-area" />

      <n-space justify="end">
        <n-text depth="3">
          <small>
            <!-- @TODO if proper permission is owned, it should be clickable (to view user profile) - UserNotesModal -->
            {{ createdBy.fullName }}

            <n-tooltip trigger="hover" placement="right">
              <template #trigger>
                ({{ dateService.fromNow(note.createdAt) }})
              </template>

              {{ dateService.format(note.createdAt, "YYYY-MM-DD HH:mm") }}
            </n-tooltip>
          </small>
        </n-text>
      </n-space>

      <n-space
        v-if="!note.isDeleted"
        justify="end"
        :style="{ marginTop: '5px' }"
      >
        <n-button
          v-if="isNoteOwner || canEditAnyNote"
          size="tiny"
          type="info"
          :disabled="noteToDeleteId === note.id"
          @click="$emit('edit-note')"
        >
          Edit
        </n-button>

        <n-popconfirm @positive-click="$emit('delete-note')">
          <template #trigger>
            <n-button
              v-if="canDeleteAnyNote"
              size="tiny"
              type="error"
              :disabled="noteToDeleteId === note.id"
            >
              Delete
            </n-button>
          </template>

          Are you sure?
        </n-popconfirm>
      </n-space>
    </n-card>
  </n-thing>
</template>

<script setup lang="ts">
import {
  NCard,
  NText,
  NThing,
  NSpace,
  NButton,
  NTooltip,
  NPopconfirm,
} from "naive-ui";
import { toRefs } from "vue";

import { useAuthStore } from "@/store/auth";
import type { INoteDTO } from "@shared/types/DTOs/Note";
import { defineComputed } from "@/helpers/defineComputed";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import { useMarkdownService } from "@/services/useMarkdownService";

const authStore = useAuthStore();
const dateService = useDateService();
const markdown = useMarkdownService();

interface IProps {
  note: INoteDTO;

  noteToDeleteId: number;
}

const props = defineProps<IProps>();

defineEmits(["edit-note", "delete-note", "toggle-user-comments-modal"]);

const { note } = toRefs(props);

const { createdBy, isNoteOwner, canEditAnyNote, canDeleteAnyNote } =
  defineComputed({
    createdBy() {
      return props.note.createdBy;
    },

    isNoteOwner() {
      return authStore.loggedUserId === createdBy.value.id;
    },

    canViewUserNotes() {
      return authStore.hasPermission(Permission.ViewUserNotes);
    },

    canEditAnyNote() {
      return authStore.hasPermission(Permission.UpdateAnyNote);
    },

    canDeleteAnyNote() {
      return authStore.hasPermission(Permission.DeleteAnyNote);
    },
  });
</script>
