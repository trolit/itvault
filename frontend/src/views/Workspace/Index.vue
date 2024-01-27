<template>
  <div :class="['page', `${workspacesStore.activePage}-page`]">
    <component
      v-if="!isLoading"
      :is="IS_INSIGHTS_PAGE_ACTIVE ? InsightsPage : DataPage"
    />

    <!-- @TODO allow to pass custom message -->
    <loading-page v-else :is-failed="isFailed" />
  </div>
</template>

<script setup lang="ts">
import { AxiosError } from "axios";
import { useRoute } from "vue-router";
import { onBeforeMount, ref, toRefs } from "vue";

import DataPage from "./Data.vue";
import InsightsPage from "./Insights.vue";
import { useAuthStore } from "@/store/auth";
import { useWorkspacesStore } from "@/store/workspaces";
import LoadingPage from "@/components/common/LoadingPage.vue";
import { ROUTE_INSIGHTS_NAME } from "@/assets/constants/routes";

const route = useRoute();
const authStore = useAuthStore();
const workspacesStore = useWorkspacesStore();
const { IS_INSIGHTS_PAGE_ACTIVE } = toRefs(workspacesStore);

const isFailed = ref(false);
const isLoading = ref(false);

onBeforeMount(async () => {
  const {
    params: { slug, section },
  } = route;

  workspacesStore.activePage =
    section.toString() === ROUTE_INSIGHTS_NAME ? "insights" : "data";

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

async function sendViewWorkspaceMessage() {
  await authStore.socketSendMessage({
    type: authStore.SOCKET_MESSAGE_TYPE.VIEW_WORKSPACE.TYPE,
    data: workspacesStore.activeItemId,
  });
}
</script>
