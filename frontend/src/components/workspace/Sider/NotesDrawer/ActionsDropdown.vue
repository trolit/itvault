<template>
  <n-dropdown
    size="small"
    trigger="click"
    :options="options"
    placement="bottom-end"
    @select="handleSelect"
  >
    <n-button quaternary>
      <n-icon :size="20" :component="GearIcon" />
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import {
  NIcon,
  NText,
  NButton,
  NDropdown,
  useDialog,
  useMessage,
} from "naive-ui";
import { h, toRefs } from "vue";
import { OperationsField as GearIcon } from "@vicons/carbon";

import { useNotesStore } from "@/store/notes";
import { useFilesStore } from "@/store/files";
import { defineComputed } from "@/helpers/defineComputed";
import type { INoteDto } from "@shared/types/dtos/INoteDto";

const dialog = useDialog();
const message = useMessage();
const filesStore = useFilesStore();
const notesStore = useNotesStore();

interface IProps {
  note: INoteDto;

  isNoteOwner: boolean;

  canViewUserNotes: boolean;

  canDeleteAnyNote: boolean;

  canUpdateAnyNote: boolean;
}

const props = defineProps<IProps>();

const emit = defineEmits(["toggle-note-update", "toggle-user-comments-modal"]);

const {
  note,
  isNoteOwner,
  canViewUserNotes,
  canUpdateAnyNote,
  canDeleteAnyNote,
} = toRefs(props);

const { options } = defineComputed({
  options() {
    return [
      {
        label: "Profile",
        key: "profile",
        disabled: true,
      },
      {
        label: "Comments",
        key: "notes",
        show: canViewUserNotes.value,
      },
      {
        label: "Update",
        key: "update",
        show: isNoteOwner.value && !note.value.isDeleted,
      },
      {
        key: "update-any",
        label: () =>
          h(NText, { type: "info" }, { default: () => "Update (any)" }),
        show:
          canUpdateAnyNote.value && !isNoteOwner.value && !note.value.isDeleted,
      },
      {
        key: "delete",
        label: () => h(NText, { type: "error" }, { default: () => "Delete" }),
        show: canDeleteAnyNote.value && !note.value.isDeleted,
      },
    ];
  },
});

function handleSelect(key: string) {
  if (key === "notes") {
    emit("toggle-user-comments-modal");

    return;
  }

  if (key === "update" || key === "update-any") {
    emit("toggle-note-update");

    return;
  }

  if (key === "delete") {
    const deleteDialog = dialog.warning({
      title: "Confirm",
      content: "Are you sure?",
      positiveText: "Delete",
      negativeText: "Close",
      onPositiveClick: async () => {
        deleteDialog.loading = true;

        const fileId = filesStore.activeFileId;

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
        }
      },
    });

    return;
  }
}
</script>
