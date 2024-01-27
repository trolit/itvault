<template>
  <general-layout id="general-layout">
    <template #sider>
      <sider :is-loading-file-from-url="isLoadingFileFromUrl" />
    </template>

    <template #main-content>
      <main-content :is-loading-file-from-url="isLoadingFileFromUrl" />
    </template>
  </general-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";

import { useFilesStore } from "@/store/files";
import { useGeneralStore } from "@/store/general";
import { useVariantsStore } from "@/store/variants";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineWatchers } from "@/helpers/defineWatchers";
import Sider from "@/components/workspace/Sider/Index.vue";
import GeneralLayout from "@/components/workspace/GeneralLayout.vue";
import MainContent from "@/components/workspace/MainContent/Index.vue";

const route = useRoute();
const filesStore = useFilesStore();
const generalStore = useGeneralStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const isLoadingFileFromUrl = ref(false);
const { activeTab } = storeToRefs(variantsStore);
const { activeFileId } = storeToRefs(filesStore);
const { generalLayoutSiderKey } = storeToRefs(workspacesStore);

onBeforeMount(async () => {
  const {
    params: { section },
  } = route;

  workspacesStore.generalLayoutSiderKey = section.toString();

  const fileId = workspacesStore.getUrlSearchParamValue(route, "fileId");
  const parsedFileId = fileId ? parseInt(fileId) : 0;

  if (parsedFileId) {
    isLoadingFileFromUrl.value = true;

    loadFileFromUrl(parsedFileId);
  }
});

async function loadFileFromUrl(fileId: number) {
  const variantIdFromUrl = workspacesStore.getUrlSearchParamValue(
    route,
    "variantId"
  );

  const blueprintIdFromUrl = workspacesStore.getUrlSearchParamValue(
    route,
    "blueprintId"
  );

  try {
    const file = await filesStore.getById(fileId);

    filesStore.setActiveTab(file, {
      variantId: variantIdFromUrl || undefined,
      blueprintId: blueprintIdFromUrl
        ? parseInt(blueprintIdFromUrl)
        : undefined,
    });
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(`Failed to fetch requested file!`);
  } finally {
    isLoadingFileFromUrl.value = false;
  }
}

defineWatchers({
  key: {
    source: generalLayoutSiderKey,
    handler: () => {
      workspacesStore.updateUrlSearchParams();
    },
  },

  fileId: {
    source: activeFileId,
    handler: () => {
      workspacesStore.updateUrlSearchParams();
    },
  },

  variantTab: {
    source: activeTab,
    handler: () => {
      workspacesStore.updateUrlSearchParams();
    },
    options: {
      deep: true,
    },
  },
});
</script>
