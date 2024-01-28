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
        <global-chat
          @add-message="onAddMessage"
          @update-message="onUpdateMessage"
          @reply-to-message="onReplyToMessage"
        />
      </n-layout-sider>

      <n-layout-content id="main-layout-content">
        <n-scrollbar>
          <router-view />
        </n-scrollbar>
      </n-layout-content>
    </n-layout>

    <add-edit-message-drawer
      :is-visible="isAddEditMessageDrawerVisible"
      :to-reply="messageToReplyTo"
      :to-update="messageToUpdate"
      @close="isAddEditMessageDrawerVisible = false"
    />
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
import { ref, watch, type Ref } from "vue";
import { storeToRefs } from "pinia";

import { useGeneralStore } from "@/store/general";
import { LoadingState } from "@/types/enums/LoadingState";
import GlobalChat from "@/components/GlobalChat/Index.vue";
import { ROUTE_LOGIN_NAME } from "@/assets/constants/routes";
import type { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";
import AddEditMessageDrawer from "@/components/GlobalChat/AddEditMessageDrawer.vue";

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

const isAddEditMessageDrawerVisible = ref(false);

generalStore.setMessageProvider(message);

const messageToUpdate: Ref<IChatMessageDTO | undefined> = ref(undefined);
const messageToReplyTo: Ref<IChatMessageDTO | undefined> = ref(undefined);

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

function onAddMessage() {
  prepareAddEditMessageDrawer({
    closeHandler: () => {
      return isAddEditMessageDrawerVisible.value === true;
    },
    showHandler: () => {
      messageToUpdate.value = undefined;
      messageToReplyTo.value = undefined;
    },
  });
}

function onUpdateMessage(item: IChatMessageDTO) {
  prepareAddEditMessageDrawer({
    closeHandler: () => {
      return item.id === messageToUpdate.value?.id;
    },
    showHandler: () => {
      messageToUpdate.value = item;
      messageToReplyTo.value = undefined;
    },
  });
}

function onReplyToMessage(item: IChatMessageDTO) {
  prepareAddEditMessageDrawer({
    closeHandler: () => {
      return item.id === messageToReplyTo.value?.id;
    },
    showHandler: () => {
      messageToUpdate.value = undefined;
      messageToReplyTo.value = item;
    },
  });
}

function prepareAddEditMessageDrawer(callbacks: {
  showHandler: () => void;
  closeHandler: () => boolean;
}) {
  if (
    isAddEditMessageDrawerVisible.value === true &&
    callbacks.closeHandler()
  ) {
    isAddEditMessageDrawerVisible.value = false;

    return;
  }

  callbacks.showHandler();

  isAddEditMessageDrawerVisible.value = true;
}
</script>
