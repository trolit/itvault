<template>
  <div class="logs-tab">
    <loading-section v-if="isLoading" spin-size="large" />

    <div class="wrapper" v-else>
      <log-table :is-loading="isLoading" @get-logs="fetchAll($event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

import LogTable from "./Table.vue";
import { useGeneralStore } from "@/store/general";
import { useInsightsStore } from "@/store/insights";
import { useWorkspacesStore } from "@/store/workspaces";
import LoadingSection from "@/components/common/LoadingSection.vue";

const generalStore = useGeneralStore();
const insightsStore = useInsightsStore();
const workspacesStore = useWorkspacesStore();

const isLoading = ref(false);
const { logsTabData } = storeToRefs(insightsStore);

onBeforeMount(() => {
  if (!logsTabData.value.items.length) {
    fetchAll(1);
  }
});

async function fetchAll(page: number) {
  isLoading.value = true;

  const { pagination } = logsTabData.value;

  try {
    const {
      data: { total, result },
    } = await workspacesStore.getTraces({
      ...pagination,
      page,
    });

    logsTabData.value.total = total;
    logsTabData.value.items = result;
    logsTabData.value.pagination.page = page;
  } catch (error) {
    console.error(error);

    generalStore.messageProvider.error(
      `Failed to fetch page ${pagination.page} of logs.`
    );
  } finally {
    isLoading.value = false;
  }
}
</script>
