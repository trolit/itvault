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
import { h, ref, toRefs } from "vue";
import { NDropdown, NIcon, NButton, NText } from "naive-ui";
import { OperationsField as GearIcon } from "@vicons/carbon";

interface IProps {
  isNoteOwner: boolean;

  canViewUserNotes: boolean;

  canDeleteAnyNote: boolean;

  canUpdateAnyNote: boolean;
}

const props = defineProps<IProps>();

const emit = defineEmits(["toggle-user-comments-modal", "toggle-note-update"]);

const { isNoteOwner, canViewUserNotes, canUpdateAnyNote, canDeleteAnyNote } =
  toRefs(props);

const options = ref([
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
    show: isNoteOwner.value,
  },
  {
    key: "update-any",
    label: () => h(NText, { type: "info" }, { default: () => "Update (any)" }),
    show: canUpdateAnyNote.value && !isNoteOwner.value,
  },
  {
    key: "delete",
    label: () => h(NText, { type: "error" }, { default: () => "Delete" }),
    show: canDeleteAnyNote.value,
  },
]);

function handleSelect(key: string) {
  if (key === "notes") {
    emit("toggle-user-comments-modal");

    return;
  }

  if (key === "update" || key === "update-any") {
    emit("toggle-note-update");

    return;
  }
}
</script>
