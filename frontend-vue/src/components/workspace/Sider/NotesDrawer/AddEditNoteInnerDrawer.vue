<template>
  <n-drawer
    :show="isVisible"
    resizable
    :default-height="300"
    :min-height="300"
    placement="bottom"
    :show-mask="false"
    :trap-focus="false"
    to="#notes-drawer-content"
  >
    <n-drawer-content
      :footer-style="{
        display: 'flex',
        margin: '0 10px',
        justifyContent: 'space-between',
      }"
    >
      <!-- @TODO menu that allows to input markdown syntax at carriage position -->
      <n-form :show-label="false" :style="{ paddingTop: '20px' }">
        <n-form-item
          :feedback="getError('text')"
          :validation-status="hasError('text')"
        >
          <n-input
            v-model:value="text"
            type="textarea"
            placeholder="comment..."
            :autosize="{
              minRows: 8,
            }"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-button secondary :loading="isLoading" @click="$emit('close')">
          Cancel
        </n-button>

        <n-button
          type="info"
          secondary
          @click="onSubmit"
          :loading="isLoading"
          :disabled="isInitialValue"
        >
          Save
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NForm,
  NInput,
  NButton,
  NDrawer,
  NFormItem,
  NDrawerContent,
} from "naive-ui";
import { ref, toRefs } from "vue";
import { object, string } from "yup";

import { useFilesStore } from "@/store/files";
import { useNotesStore } from "@/store/notes";
import { defineForm } from "@/helpers/defineForm";
import { useGeneralStore } from "@/store/general";
import type { INoteDTO } from "@shared/types/DTOs/Note";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";

interface IProps {
  isVisible: boolean;

  noteToEdit: INoteDTO | null;
}

const filesStore = useFilesStore();
const notesStore = useNotesStore();
const generalStore = useGeneralStore();

const props = defineProps<IProps>();

const emits = defineEmits(["close", "update-note", "refetch-notes"]);

const { isVisible, noteToEdit } = toRefs(props);

const defaultFormData: { text: string } = {
  text: "",
};

const {
  fields,
  getError,
  hasError,
  setFormData,
  handleSubmit,
  resetForm,
  setValidationErrors,
} = defineForm<{
  text: string;
}>(
  defaultFormData,
  object({
    text: string().required(),
  })
);

const fileId = ref(0);
const isLoading = ref(false);

const {
  text: { value: text },
} = fields;

const { isInitialValue } = defineComputed({
  isInitialValue() {
    return (noteToEdit.value?.value || defaultFormData.text) === text.value;
  },
});

defineWatchers({
  isVisible: {
    source: isVisible,
    handler: () => {
      if (!isVisible.value) {
        setTimeout(() => {
          resetForm();
        }, 500);

        return;
      }

      if (noteToEdit.value) {
        setFormData({ text: noteToEdit.value.value });
      }

      fileId.value = filesStore.activeFileId;
    },
  },

  noteToEdit: {
    source: noteToEdit,
    handler: () => {
      if (noteToEdit.value) {
        setFormData({ text: noteToEdit.value.value });
      }
    },
    options: {
      deep: true,
    },
  },
});

const onSubmit = handleSubmit.withControlled(async formData => {
  isLoading.value = true;

  if (!fileId.value) {
    generalStore.messageProvider.error(
      "Failed to save note (file tab not found)!"
    );

    return;
  }

  const noteId = noteToEdit.value?.id;

  try {
    noteId
      ? await notesStore.update(noteId, formData.text)
      : await notesStore.add(formData.text, fileId.value);

    if (noteId) {
      emits("update-note", formData.text);
    } else {
      emits("refetch-notes");
    }

    generalStore.messageProvider.success(
      `Note ${noteId ? "updated" : "added"}!`
    );

    emits("close");
  } catch (error) {
    console.log(error);

    setValidationErrors(error);

    generalStore.messageProvider.error(
      `Failed to ${noteId ? "update" : "add"} note!`
    );
  } finally {
    isLoading.value = false;
  }
});
</script>
