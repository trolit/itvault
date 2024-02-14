<template>
  <div :class="['page', `${IS_INSIGHTS_PAGE ? 'insights' : 'data'}-page`]">
    <component
      v-if="!isLoading && !responseError"
      :key="workspacesStore.activeItemId"
      :is="IS_INSIGHTS_PAGE ? InsightsPage : DataPage"
    />

    <loading-page v-else :error="responseError" />
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";
import { computed, onBeforeMount, ref, type Ref } from "vue";

import DataPage from "./Data.vue";
import InsightsPage from "./Insights.vue";
import { useAuthStore } from "@/store/auth";
import { useWorkspacesStore } from "@/store/workspaces";
import LoadingPage from "@/components/common/LoadingPage.vue";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const responseError: Ref<AxiosError<any, any> | null> = ref(null);

onBeforeMount(async () => {
  const {
    params: { slug },
  } = route;

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
    console.log(error);

    // @TODO create API errors handler/parser
    if (error instanceof AxiosError && error.response) {
      responseError.value = error;

      const {
        response: { status },
      } = error;

      if (status === 401 || status === 403) {
        router.push({ name: ROUTE_DASHBOARD_NAME });
      }
    }
  } finally {
    isLoading.value = false;
  }
});

async function sendViewWorkspaceMessage() {
  await authStore.socketSendMessage({
    type: authStore.SOCKET_MESSAGE_TYPE.VIEW_WORKSPACE.TYPE,
    data: workspacesStore.activeItemId,
  });
}

const IS_INSIGHTS_PAGE = computed(() => {
  return route.params.section === "insights";
});
</script>
