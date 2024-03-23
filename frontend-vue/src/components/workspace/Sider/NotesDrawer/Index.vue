<template>
  <n-drawer
    resizable
    :show="isActive"
    placement="left"
    :min-width="340"
    :default-width="340"
    :show-mask="false"
    :trap-focus="false"
    to="#general-layout"
    :block-scroll="false"
    :mask-closable="false"
    class="notes-drawer"
    @update:show="drawerStore.setActiveDrawer(null)"
  >
    <n-drawer-content
      id="notes-drawer-content"
      title="Notes"
      closable
      :footer-style="{
        display: 'flex',
        margin: '0 10px',
        justifyContent: 'space-between',
      }"
    >
      <loading-section v-if="isLoading" />

      <n-result
        v-else-if="!notes.data.length"
        size="small"
        status="info"
        title="Empty"
        description="No comments to display"
      />

      <n-list v-else-if="notes.data.length" :show-divider="false">
        <n-list-item v-for="note in notes.data" :key="`note-${note.id}`">
          <single-note
            :note="note"
            :note-to-delete-id="noteToDeleteId"
            @edit-note="onNoteEdit(note)"
            @delete-note="deleteNote(note)"
            @toggle-user-comments-modal="onToggleUserCommentsModal"
          />
        </n-list-item>
      </n-list>

      <add-edit-note-inner-drawer
        :note-to-edit="noteToEdit"
        :is-visible="isAddEditNoteDrawerVisible"
        @update-note="onNoteUpdate"
        @refetch-notes="refetchNotes"
        @close="onAddEditNoteInnerDrawerClose"
      />

      <template #footer>
        <n-pagination
          :disabled="isLoading"
          size="small"
          :page="notes.page"
          :page-size="perPage"
          :item-count="notes.total"
          :page-slot="6"
          @update:page="onPageChange"
        />

        <n-button
          :disabled="isLoading"
          size="small"
          ghost
          @click="isAddEditNoteDrawerVisible = true"
        >
          <n-icon :component="AddIcon" :size="25" />
        </n-button>
      </template>

      <user-notes-modal
        v-model:show="isUserNotesModalVisible"
        :id="userId"
        :full-name="userFullName"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  NList,
  NIcon,
  NButton,
  NDrawer,
  NResult,
  NListItem,
  NPagination,
  NDrawerContent,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { storeToRefs } from "pinia";
import { Add as AddIcon } from "@vicons/carbon";

import SingleNote from "./SingleNote.vue";
import { Drawer } from "@/types/enums/Drawer";
import { useFilesStore } from "@/store/files";
import { useNotesStore } from "@/store/notes";
import { useDrawerStore } from "@/store/drawer";
import { useGeneralStore } from "@/store/general";
import UserNotesModal from "./UserNotesModal.vue";
import type { INoteDTO } from "@shared/types/DTOs/Note";
import { defineComputed } from "@/helpers/defineComputed";
import { defineWatchers } from "@/helpers/defineWatchers";
import AddEditNoteInnerDrawer from "./AddEditNoteInnerDrawer.vue";
import LoadingSection from "@/components/common/LoadingSection.vue";

const filesStore = useFilesStore();
const notesStore = useNotesStore();
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();

const perPage = 5;
const userId = ref(0);
const isLoading = ref(true);
const userFullName = ref("");
const noteToDeleteId = ref(0);
const isUserNotesModalVisible = ref(false);
const isAddEditNoteDrawerVisible = ref(false);
const noteToEdit: Ref<INoteDTO | null> = ref(null);

const { activeTab } = storeToRefs(filesStore);

const { isActive, notes } = defineComputed({
  isActive() {
    return drawerStore.isDrawerActive(Drawer.Notes) || false;
  },

  notes() {
    const tab = filesStore.activeTab;

    return tab ? tab.notes : { page: 1, total: 0, data: [] };
  },
});

defineWatchers({
  isActive: {
    source: isActive,
    handler: () => {
      if (!isActive.value) {
        isAddEditNoteDrawerVisible.value = false;

        return;
      }

      if (!notes.value.data.length) {
        fetchNotes();
      }
    },
  },

  activeTab: {
    source: activeTab,
    handler: () => {
      if (!activeTab || !isActive.value) {
        return;
      }

      if (!notes.value.data.length) {
        fetchNotes();
      }
    },
  },
});

function onPageChange(newPage: number) {
  if (filesStore.activeTab) {
    filesStore.activeTab.notes.page = newPage;

    fetchNotes();
  }
}

function onToggleUserCommentsModal(id: number, fullName: string) {
  userId.value = id;
  userFullName.value = fullName;

  isUserNotesModalVisible.value = true;
}

function refetchNotes() {
  if (filesStore.activeTab) {
    filesStore.activeTab.notes.page = 1;

    fetchNotes();
  }
}

async function fetchNotes() {
  isLoading.value = true;

  try {
    await notesStore.getAll({
      page: notes.value.page,
      perPage,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

function onNoteEdit(note: INoteDTO) {
  if (
    noteToEdit.value &&
    noteToEdit.value.id === note.id &&
    isAddEditNoteDrawerVisible.value === true
  ) {
    onAddEditNoteInnerDrawerClose();

    return;
  }

  isAddEditNoteDrawerVisible.value = true;

  noteToEdit.value = note;
}

function onNoteUpdate(text: string) {
  if (noteToEdit.value) {
    noteToEdit.value.value = text;
  }
}

async function deleteNote(note: INoteDTO) {
  const fileId = filesStore.activeFileId;

  if (!fileId) {
    generalStore.messageProvider.error(
      "Failed to delete note (file tab not found)!"
    );

    return;
  }

  noteToDeleteId.value = note.id;

  try {
    await notesStore.delete(note.id);

    generalStore.messageProvider.success("Note deleted.");
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error("Failed to delete note!");
  } finally {
    noteToDeleteId.value = 0;
  }
}

function onAddEditNoteInnerDrawerClose() {
  noteToEdit.value = null;

  isAddEditNoteDrawerVisible.value = false;
}
</script>
