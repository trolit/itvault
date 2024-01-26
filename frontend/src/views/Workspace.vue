<template>
  <div class="workspace-page page">
    <!-- @TODO allow to pass custom message -->
    <loading-page v-if="isLoading" :is-failed="isFailed" />

    <general-layout
      :key="workspacesStore.activeItemId"
      id="general-layout"
      v-else-if="!isFailed"
    >
      <template #sider>
        <sider :is-loading-file-from-url="isLoadingFileFromUrl" />
      </template>

      <template #main-content>
        <main-content :is-loading-file-from-url="isLoadingFileFromUrl" />
      </template>
    </general-layout>
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";

import { useAuthStore } from "@/store/auth";
import { useFilesStore } from "@/store/files";
import { useGeneralStore } from "@/store/general";
import { useVariantsStore } from "@/store/variants";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineWatchers } from "@/helpers/defineWatchers";
import Sider from "@/components/workspace/Sider/Index.vue";
import LoadingPage from "@/components/common/LoadingPage.vue";
import GeneralLayout from "@/components/workspace/GeneralLayout.vue";
import MainContent from "@/components/workspace/MainContent/Index.vue";

const route = useRoute();
const authStore = useAuthStore();
const filesStore = useFilesStore();
const generalStore = useGeneralStore();
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const isFailed = ref(false);
const isLoading = ref(false);
const isLoadingFileFromUrl = ref(false);
const { activeTab } = storeToRefs(variantsStore);
const { activeFileId } = storeToRefs(filesStore);
const { generalLayoutSiderKey } = storeToRefs(workspacesStore);

onBeforeMount(async () => {
  const {
    params: { slug },
  } = route;

  loadGeneralLayoutSiderKeyFromUrl();

  const { activeItem } = workspacesStore;

  if (activeItem.id) {
    sendViewWorkspaceMessage();

    return;
  }

  isLoading.value = true;

  try {
    await workspacesStore.getBySlug(slug as string);

    sendViewWorkspaceMessage();
  } catch (error) {
    // @TODO create API errors handler/parser
    if (error instanceof AxiosError && error.response) {
      console.log(error.response.statusText);
    }

    isFailed.value = true;
  } finally {
    isLoading.value = false;
  }

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

function loadGeneralLayoutSiderKeyFromUrl() {
  const value = workspacesStore.getUrlSearchParamValue(route, "sider");

  workspacesStore.generalLayoutSiderKey =
    !!value && typeof value === "string"
      ? value
      : workspacesStore.DEFAULT_GENERAL_LAYOUT_SIDER_KEY;
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

async function sendViewWorkspaceMessage() {
  await authStore.socketSendMessage({
    type: authStore.SOCKET_MESSAGE_TYPE.VIEW_WORKSPACE.TYPE,
    data: workspacesStore.activeItemId,
  });
}
</script>
