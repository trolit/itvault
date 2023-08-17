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

      <n-list v-else :show-divider="false">
        <n-list-item v-for="note in notes" :key="`note-${note.id}`">
          <single-note
            :note="note"
            @toggle-user-comments-modal="onToggleUserCommentsModal"
          />
        </n-list-item>
      </n-list>

      <template #footer>
        <!-- @TODO implement pagination -->
        <n-pagination
          v-model:page="page"
          v-model:page-size="perPage"
          :page-count="9"
          :page-slot="6"
        />
      </template>

      <user-comments-modal
        v-model:show="isUserCommentsModalVisible"
        :id="userId"
        :full-name="userFullName"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  NList,
  NSpin,
  NDrawer,
  NListItem,
  NPagination,
  NDrawerContent,
} from "naive-ui";

import { Drawer } from "@/types/Drawer";
import SingleNote from "./SingleNote.vue";
import { useNotesStore } from "@/store/notes";
import { useDrawerStore } from "@/store/drawer";
import UserCommentsModal from "./UserCommentsModal.vue";
import { useWorkspacesStore } from "@/store/workspaces";

const page = ref(1);
const perPage = ref(5);
const userId = ref(0);
const isLoading = ref(true);
const userFullName = ref("");
const isUserCommentsModalVisible = ref(false);

const notesStore = useNotesStore();
const drawerStore = useDrawerStore();
const workspacesStore = useWorkspacesStore();

const isActive = computed((): boolean => {
  return drawerStore.isDrawerActive(Drawer.Notes) || false;
});

const notes = computed(() => {
  const tab = workspacesStore.activeFileTabValue;

  return tab ? tab.notes.data : [];
});

const onShowUpdate = () => {
  drawerStore.setActiveDrawer(null);
};

watch(isActive, async () => {
  if (!isActive.value) {
    return;
  }

  isLoading.value = true;

  try {
    await notesStore.getAll({ page: 1, perPage: 5, resource: "File" });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});

function onToggleUserCommentsModal(id: number, fullName: string) {
  userId.value = id;
  userFullName.value = fullName;

  isUserCommentsModalVisible.value = true;
}
</script>
