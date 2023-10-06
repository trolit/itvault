<template>
  <!-- @TODO show some indicator if message is removed or not (display only if permission is enabled)-->
  <n-thing class="single-note" :style="{ opacity: note.isDeleted ? 0.4 : 1 }">
    <template #avatar>
      <n-avatar size="small"> {{ initials }} </n-avatar>
    </template>

    <template #header>
      <span>
        {{ createdBy.fullName }}
      </span>

      <br />

      <n-tag size="small">
        {{ createdBy.role }}
      </n-tag>
    </template>

    <template #header-extra>
      <actions-dropdown
        v-if="
          isNoteOwner ||
          canViewUserNotes ||
          canDeleteAnyNote ||
          canUpdateAnyNote
        "
        :is-deleted="note.isDeleted"
        :disabled="isLoading"
        :is-note-owner="isNoteOwner"
        :is-removing-element="isLoading"
        :can-view-user-notes="canViewUserNotes"
        :can-delete-any-note="canDeleteAnyNote"
        :can-update-any-note="canUpdateAnyNote"
        @delete="deleteNote"
        @toggle-note-update="$emit('edit-note')"
        @toggle-user-comments-modal="
          emits('toggle-user-comments-modal', createdBy.id, createdBy.fullName)
        "
      />
    </template>

    <template #description>
      <n-tooltip trigger="hover" placement="right">
        <template #trigger>
          <n-text depth="3">
            <small>{{ dateService.fromNow(note.createdAt) }}</small>
          </n-text>
        </template>

        {{ dateService.format(note.createdAt, "YYYY-MM-DD HH:mm") }}
      </n-tooltip>
    </template>

    <n-card>
      <div v-html="markdown.render(note.value)" class="note-render-area" />
    </n-card>
  </n-thing>
</template>

<script setup lang="ts">
import {
  NTag,
  NCard,
  NText,
  NThing,
  NAvatar,
  NTooltip,
  useMessage,
} from "naive-ui";
import { toRefs, type PropType, ref } from "vue";

import { useAuthStore } from "@/store/auth";
import { useNotesStore } from "@/store/notes";
import ActionsDropdown from "./ActionsDropdown.vue";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
import { useMarkdownService } from "@/services/useMarkdownService";

const message = useMessage();
const authStore = useAuthStore();
const notesStore = useNotesStore();
const dateService = useDateService();
const markdown = useMarkdownService();
const workspacesStore = useWorkspacesStore();

const props = defineProps({
  note: {
    type: Object as PropType<INoteDto>,
    required: true,
  },
});

const emits = defineEmits(["toggle-user-comments-modal", "edit-note"]);

const isLoading = ref(false);

const { note } = toRefs(props);

const {
  initials,
  createdBy,
  isNoteOwner,
  canViewUserNotes,
  canUpdateAnyNote,
  canDeleteAnyNote,
} = defineComputed({
  initials() {
    const [name, surname] = props.note.createdBy.fullName.split(" ");

    return `${name[0]}${surname[0]}`;
  },

  createdBy() {
    return props.note.createdBy;
  },

  isNoteOwner() {
    return authStore.loggedUserId === createdBy.value.id;
  },

  canViewUserNotes() {
    return authStore.hasPermission(Permission.ViewUserNotes);
  },

  canUpdateAnyNote() {
    return authStore.hasPermission(Permission.UpdateAnyNote);
  },

  canDeleteAnyNote() {
    return authStore.hasPermission(Permission.DeleteAnyNote);
  },
});

async function deleteNote() {
  isLoading.value = true;

  const fileId = workspacesStore.activeFileTab?.file.id;

  if (!fileId) {
    message.error("Failed to delete note (file tab not found)!");

    return;
  }

  try {
    await notesStore.delete(note.value.id, fileId);

    message.success("Note deleted.");
  } catch (error) {
    console.log(error);

    message.error("Failed to delete note!");
  } finally {
    isLoading.value = false;
  }
}
</script>
