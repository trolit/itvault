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
      <n-list :show-divider="false">
        <n-list-item v-for="note in notes" :key="`note-${note.id}`">
          <single-note :note="note" />
        </n-list-item>
      </n-list>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { NDrawer, NDrawerContent, NList, NListItem } from "naive-ui";

import { Drawer } from "@/types/Drawer";
import SingleNote from "./SingleNote.vue";
import { useFilesStore } from "@/store/files";
import { useNotesStore } from "@/store/notes";
import { useDrawerStore } from "@/store/drawer";

const isLoading = ref(false);

const notesStore = useNotesStore();
const filesStore = useFilesStore();
const drawerStore = useDrawerStore();

const isActive = computed((): boolean => {
  return drawerStore.isDrawerActive(Drawer.Notes) || false;
});

const notes = computed(() => {
  const tab = filesStore.getActiveTab();

  return tab ? tab.notes.values : [];
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
</script>
