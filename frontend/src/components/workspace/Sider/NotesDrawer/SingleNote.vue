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
        @toggle-note-update="toggleUpdateMode"
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

    <!-- @TODO markdown compiler -->
    <div v-if="isInUpdateMode">
      <n-input
        v-model:value="updatedValue"
        type="textarea"
        :autosize="{
          minRows: 5,
        }"
      />

      <n-text v-if="lastErrorMessage" type="error">
        Error: {{ lastErrorMessage }}
      </n-text>
    </div>

    <n-card v-else>
      <div v-html="markdown.render(note.value)" />
    </n-card>

    <template #footer>
      <n-space v-if="isInUpdateMode" class="w-100" justify="space-between">
        <n-button secondary @click="toggleUpdateMode" :loading="isLoading">
          Cancel
        </n-button>

        <n-button
          type="info"
          secondary
          :loading="isLoading"
          :disabled="isUpdatedValueMatchingOriginalValue"
          @click="updateNote"
        >
          Save
        </n-button>
      </n-space>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import {
  NTag,
  NCard,
  NText,
  NInput,
  NSpace,
  NThing,
  NAvatar,
  NButton,
  NTooltip,
  useMessage,
} from "naive-ui";
import { AxiosError } from "axios";
import { toRefs, type PropType, ref } from "vue";

import { useAuthStore } from "@/store/auth";
import { useNotesStore } from "@/store/notes";
import type { ApiError } from "@/types/ApiError";
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

const emits = defineEmits(["toggle-user-comments-modal", "update-note"]);

const isLoading = ref(false);
const updatedValue = ref("");
const lastErrorMessage = ref("");
const isInUpdateMode = ref(false);

const { note } = toRefs(props);

const {
  initials,
  createdBy,
  isNoteOwner,
  canViewUserNotes,
  canUpdateAnyNote,
  canDeleteAnyNote,
  isUpdatedValueMatchingOriginalValue,
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

  isUpdatedValueMatchingOriginalValue() {
    return props.note.value === updatedValue.value;
  },
});

function toggleUpdateMode() {
  if (!isInUpdateMode.value) {
    updatedValue.value = props.note.value;
  }

  lastErrorMessage.value = "";

  isInUpdateMode.value = !isInUpdateMode.value;
}

async function updateNote() {
  isLoading.value = true;

  try {
    const id = props.note.id;

    await notesStore.update(id, updatedValue.value);

    emits("update-note", updatedValue.value);

    toggleUpdateMode();

    message.success("Note updated!");
  } catch (error) {
    console.log(error);

    message.error("Failed to update note.");

    if (error instanceof AxiosError) {
      const data: ApiError<{ text: string[] }> = error.response?.data;

      const [validationMessage] = data.body.text;

      if (validationMessage) {
        lastErrorMessage.value = validationMessage;
      }
    }
  } finally {
    isLoading.value = false;
  }
}

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
