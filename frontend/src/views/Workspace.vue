<template>
  <div class="workspace-page page">
    <!-- @TODO allow to pass custom message -->
    <loading-page v-if="isLoading" :is-failed="isFailed" />

    <general-layout v-else-if="!isFailed">
      <template #sider>
        <sider />
      </template>

      <template #main-content> <main-content /> </template>
    </general-layout>
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { useWorkspacesStore } from "@/store/workspaces";

import Sider from "@/components/workspace/Sider/Index.vue";
import LoadingPage from "@/components/common/LoadingPage.vue";
import GeneralLayout from "@/components/workspace/GeneralLayout.vue";
import MainContent from "@/components/workspace/MainContent/Index.vue";

const route = useRoute();

const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const isFailed = ref(false);

onBeforeMount(async () => {
  const {
    params: { slug },
  } = route;

  const { activeItem } = workspacesStore;

  if (activeItem.id) {
    return;
  }

  isLoading.value = true;

  try {
    await workspacesStore.getBySlug(slug as string);
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
</script>
