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
        value=""
        :is-loading="isLoading"
        @save="addNote"
        @cancel="$emit('update:is-visible', false)"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";

import AddEditNoteForm from "./AddEditNoteForm.vue";

interface IProps {
  isVisible: boolean;
}

const props = defineProps<IProps>();

defineEmits(["update:is-visible"]);

const { isVisible } = toRefs(props);

const isLoading = ref(false);

function addNote() {
  // @TODO
}
</script>
