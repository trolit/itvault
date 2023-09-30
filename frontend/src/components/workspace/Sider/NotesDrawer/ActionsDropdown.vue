<template>
  <n-dropdown trigger="hover" :options="options" placement="bottom-end">
    <n-button text>
      <n-icon :size="25" :component="GearIcon" />
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import { h, ref, toRefs } from "vue";
import { NDropdown, NIcon, NButton, NText } from "naive-ui";
import { OperationsField as GearIcon } from "@vicons/carbon";

interface IProps {
  isNoteOwner: boolean;

  canDeleteAnyNote: boolean;

  canUpdateAnyNote: boolean;
}

const props = defineProps<IProps>();

const { isNoteOwner, canUpdateAnyNote, canDeleteAnyNote } = toRefs(props);

const options = ref([
  {
    label: "Update",
    key: "update",
    show: isNoteOwner.value && !canUpdateAnyNote.value,
  },
  {
    key: "update-any",
    label: () =>
      h(NText, { type: "warning" }, { default: () => "Update (any)" }),
    show: canUpdateAnyNote.value,
  },
  {
    key: "delete",
    label: () => h(NText, { type: "error" }, { default: () => "Delete" }),
    show: canDeleteAnyNote.value,
  },
]);
</script>
