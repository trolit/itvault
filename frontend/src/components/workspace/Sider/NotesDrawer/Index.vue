<template>
  <n-drawer
    :show="isActive"
    :width="340"
    placement="left"
    to="#sider"
    :show-mask="false"
    :trap-focus="false"
    :block-scroll="false"
    :mask-closable="false"
    class="notes-drawer"
    @update:show="onShowUpdate"
  >
    <n-drawer-content title="Notes" closable>
      <div v-if="isLoading" class="spin-wrapper">
        <n-spin />
      </div>

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
            @toggle-user-comments-modal="onToggleUserCommentsModal"
          />
        </n-list-item>
      </n-list>

      <template #footer>
        <n-pagination
          v-if="!isLoading"
          size="small"
          :page="notes.page"
          :page-size="perPage"
          :item-count="notes.total"
          :page-slot="6"
          @update:page="onPageChange"
        />
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
  NSpin,
  NDrawer,
  NResult,
  NListItem,
  NPagination,
  NDrawerContent,
} from "naive-ui";
import { computed, ref, watch } from "vue";

import { Drawer } from "@/types/Drawer";
import SingleNote from "./SingleNote.vue";
import { useNotesStore } from "@/store/notes";
import { useDrawerStore } from "@/store/drawer";
import UserNotesModal from "./UserNotesModal.vue";
import { useWorkspacesStore } from "@/store/workspaces";

const notesStore = useNotesStore();
const drawerStore = useDrawerStore();
const workspacesStore = useWorkspacesStore();

const perPage = 5;
const userId = ref(0);
const isLoading = ref(true);
const userFullName = ref("");
const isUserNotesModalVisible = ref(false);

const isActive = computed((): boolean => {
  return drawerStore.isDrawerActive(Drawer.Notes) || false;
});

const notes = computed(() => {
  const tab = workspacesStore.activeFileTab;

  return tab ? tab.notes : { page: 1, total: 0, data: [] };
});

const onShowUpdate = () => {
  drawerStore.setActiveDrawer(null);
};

watch(isActive, async () => {
  if (!isActive.value) {
    return;
  }

  if (!notes.value.data.length) {
    fetchNotes();
  }
});

function onPageChange(newPage: number) {
  if (workspacesStore.activeFileTab) {
    workspacesStore.activeFileTab.notes.page = newPage;

    fetchNotes();
  }
}

function onToggleUserCommentsModal(id: number, fullName: string) {
  userId.value = id;
  userFullName.value = fullName;

  isUserNotesModalVisible.value = true;
}

async function fetchNotes() {
  isLoading.value = true;

  try {
    await notesStore.getAll({
      page: notes.value.page,
      perPage,
      resource: "File",
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
