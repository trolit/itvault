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
import { OperationsField as GearIcon } from "@vicons/carbon";
import { NDropdown, NIcon, NButton, NText, useDialog } from "naive-ui";

const dialog = useDialog();

interface IProps {
  isDeleted: boolean;

  isNoteOwner: boolean;

  canViewUserNotes: boolean;

  canDeleteAnyNote: boolean;

  canUpdateAnyNote: boolean;

  isRemovingElement: boolean;
}

const props = defineProps<IProps>();

const emit = defineEmits([
  "delete",
  "toggle-note-update",
  "toggle-user-comments-modal",
]);

const {
  isDeleted,
  isNoteOwner,
  canViewUserNotes,
  canUpdateAnyNote,
  canDeleteAnyNote,
  isRemovingElement,
} = toRefs(props);

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
    show: canDeleteAnyNote.value && !isDeleted.value,
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

  if (key === "delete") {
    dialog.warning({
      title: "Confirm",
      loading: isRemovingElement.value,
      content: "Are you sure?",
      positiveText: "Delete",
      negativeText: "Cancel",
      onPositiveClick: () => emit("delete"),
    });

    return;
  }
}
</script>
