<template>
  <n-drawer
    :show="isVisible"
    resizable
    placement="bottom"
    :show-mask="false"
    :trap-focus="false"
    to="#notes-drawer-content"
  >
    <n-drawer-content>
      <add-edit-note-form
        :is-loading="isLoading"
        :value="noteToEdit?.value || ''"
        @save="save"
        @cancel="$emit('cancel')"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";

import AddEditNoteForm from "./AddEditNoteForm.vue";
import type { INoteDto } from "@shared/types/dtos/INoteDto";

interface IProps {
  isVisible: boolean;

  noteToEdit: INoteDto | null;
}

const props = defineProps<IProps>();

defineEmits(["cancel"]);

const { isVisible, noteToEdit } = toRefs(props);

const isLoading = ref(false);

function save() {
  // @TODO
}
</script>
