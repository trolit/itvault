<template>
  <div class="workspace-page page">
    <!-- @TODO allow to pass custom message -->
    <loading-page v-if="isLoading" :is-failed="isFailed" />

    <general-layout id="general-layout" v-else-if="!isFailed">
      <template #sider>
        <sider />
      </template>

      <template #main-content> <main-content /> </template>
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
const variantsStore = useVariantsStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const isFailed = ref(false);
const { activeTab } = storeToRefs(variantsStore);
const { activeFileId } = storeToRefs(filesStore);
const { generalLayoutSiderKey, ARE_ALL_INITIAL_SEARCH_PARAMS_LOADED } =
  storeToRefs(workspacesStore);

onBeforeMount(async () => {
  const {
    params: { slug },
  } = route;

  workspacesStore.readInitialSearchParamsFromUrl(route);

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
});

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

  areAllInitialSearchParamsInitialized: {
    source: ARE_ALL_INITIAL_SEARCH_PARAMS_LOADED,
    handler: (value: boolean) => {
      if (value) {
        workspacesStore.initialSearchParams = {};
      }
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
