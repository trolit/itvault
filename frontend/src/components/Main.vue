<template>
  <main :class="{ 'with-app-header': withAppHeader }">
    <n-layout class="global-layout" has-sider sider-placement="left">
      <n-layout-sider
        v-if="$route.name !== ROUTE_LOGIN_NAME"
        bordered
        :width="generalStore.GLOBAL_CHAT_WIDTH"
        :collapsed-width="0"
        collapse-mode="transform"
        :collapsed="!generalStore.isChatVisible"
      >
        <global-chat />
      </n-layout-sider>

      <n-layout-content>
        <n-scrollbar>
          <router-view />
        </n-scrollbar>
      </n-layout-content>
    </n-layout>
  </main>
</template>

<script setup lang="ts">
import {
  NLayout,
  NScrollbar,
  useMessage,
  NLayoutSider,
  useLoadingBar,
  NLayoutContent,
} from "naive-ui";
import { watch } from "vue";
import { storeToRefs } from "pinia";

import { useGeneralStore } from "@/store/general";
import { LoadingState } from "@/types/enums/LoadingState";
import GlobalChat from "@/components/GlobalChat/Index.vue";
import { ROUTE_LOGIN_NAME } from "@/assets/constants/routes";

defineProps({
  withAppHeader: {
    type: Boolean,
    required: true,
  },
});

const message = useMessage();
const loadingBar = useLoadingBar();
const generalStore = useGeneralStore();

const { loadingState } = storeToRefs(generalStore);

generalStore.setMessageProvider(message);

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
