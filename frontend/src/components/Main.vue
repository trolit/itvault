<template>
  <main :class="{ 'with-app-header': withAppHeader }">
    <n-scrollbar>
      <router-view />
    </n-scrollbar>
  </main>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { NScrollbar, useLoadingBar } from "naive-ui";

import { useGeneralStore } from "@/store/general";
import { LoadingState } from "@/types/enums/LoadingState";

defineProps({
  withAppHeader: {
    type: Boolean,
    required: true,
  },
});

const loadingBar = useLoadingBar();
const generalStore = useGeneralStore();

const { loadingState } = storeToRefs(generalStore);

watch(loadingState, () => {
  switch (loadingState.value) {
    case LoadingState.Start:
      loadingBar.start();
      break;

    case LoadingState.Finish:
      loadingBar.finish();
      break;

    case LoadingState.Error:
      loadingBar.error();
      break;
  }
});
</script>
