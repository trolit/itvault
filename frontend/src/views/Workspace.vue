<template>
  <div class="workspace-page page">
    <loading-page v-if="isLoading" :is-failed="isFailed" />
    <!-- <body-layout>
      <template #sidebar>
        <sidebar />
      </template>

      <template #content>
        <router-view name="content" />
      </template>
    </body-layout> -->
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import { useRoute } from "vue-router";
import { onBeforeMount, ref } from "vue";
import { useWorkspacesStore } from "@/stores/workspace";

import LoadingPage from "@/components/common/LoadingPage.vue";

const route = useRoute();

const workspacesStore = useWorkspacesStore();

const isLoading = ref(true);
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
