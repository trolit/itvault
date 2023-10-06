<template>
  <n-drawer
    :show="isVisible"
    resizable
    :min-height="320"
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
  useMessage,
  NDrawerContent,
} from "naive-ui";
import { ref, toRefs } from "vue";
import { object, string } from "yup";

import { useNotesStore } from "@/store/notes";
import { defineForm } from "@/helpers/defineForm";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import type { INoteDto } from "@shared/types/dtos/INoteDto";
import { useWorkspacesStore } from "@/store/workspaces";

interface IProps {
  isVisible: boolean;

  noteToEdit: INoteDto | null;
}

const message = useMessage();
const notesStore = useNotesStore();
const workspacesStore = useWorkspacesStore();

const props = defineProps<IProps>();

const emits = defineEmits(["close", "update-note", "refetch-notes"]);

const { isVisible, noteToEdit } = toRefs(props);

const defaultFormData: { text: string } = {
  text: "",
};

const { fields, getError, hasError, setFormData, handleSubmit, resetForm } =
  defineForm<{
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

      fileId.value = workspacesStore.activeFileTab?.file.id || 0;
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
    message.error("Failed to delete note (file tab not found)!");

    return;
  }

  const noteId = noteToEdit.value?.id;

  try {
    noteId
      ? await notesStore.update(noteId, formData.text)
      : await notesStore.store(formData.text, "File", fileId.value);

    if (noteId) {
      emits("update-note", formData.text);
    } else {
      emits("refetch-notes");
    }

    message.success("Note updated!");

    emits("close");
  } catch (error) {
    console.log(error);

    message.error("Failed to update note.");
  } finally {
    isLoading.value = false;
  }
});
</script>
