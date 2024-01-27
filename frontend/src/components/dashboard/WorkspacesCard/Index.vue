<template>
  <n-card
    size="medium"
    :header-extra-style="{ marginLeft: '20px' }"
    :footer-style="{ display: 'flex', justifyContent: 'center' }"
  >
    <template #header>
      <!-- @TODO show input only when there are at least 3 pages -->
      <n-input disabled clearable placeholder="Type name or tag to filter">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>
    </template>

    <template #header-extra>
      <require-permission :permission="Permission.CreateWorkspace">
        <n-button size="small" @click="toggleAddEditWorkspaceDrawer()">
          <n-icon :component="AddIcon" :size="25" />
        </n-button>
      </require-permission>
    </template>

    <n-grid
      v-if="!isLoading"
      x-gap="40"
      y-gap="20"
      responsive="screen"
      cols="1 s:1 m:2 l:2 xl:2 2xl:2"
    >
      <n-grid-item
        span="1"
        v-for="(item, index) in sortedItems"
        :key="`workspace-${index}`"
      >
        <single-item
          :item="item"
          @open="open(item)"
          @toggle-edit-drawer="toggleAddEditWorkspaceDrawer(item)"
        />
      </n-grid-item>
    </n-grid>

    <loading-section v-else />

    <template #footer>
      <n-pagination
        size="medium"
        :page-slot="6"
        :page="page"
        :page-size="perPage"
        :item-count="workspacesStore.total"
        @update:page="value => getWorkspaces(value)"
      />
    </template>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NGrid,
  NIcon,
  NInput,
  NButton,
  NGridItem,
  NPagination,
} from "naive-ui";
import { useRouter } from "vue-router";
import cloneDeep from "lodash/cloneDeep";
import { ref, onBeforeMount } from "vue";
import { Add as AddIcon, Search as SearchIcon } from "@vicons/carbon";

import SingleItem from "./SingleItem.vue";
import { useAuthStore } from "@/store/auth";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useGeneralStore } from "@/store/general";
import { BLUEPRINTS_TAB } from "@/config/constants";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { Permission } from "@shared/types/enums/Permission";
import type { IWorkspaceDTO } from "@shared/types/DTOs/Workspace";
import { ROUTE_WORKSPACES_NAME } from "@/assets/constants/routes";
import LoadingSection from "@/components/common/LoadingSection.vue";
import { sortArrayByPinnedAt } from "@/helpers/sortArrayByPinnedAt";
import RequirePermission from "@/components/common/RequirePermission.vue";
import { onSocketReceiveMessage } from "@/helpers/onSocketReceiveMessage";
import type { UpdateWorkspaceData } from "@shared/types/transport/WorkspaceMessages";

const router = useRouter();
const authStore = useAuthStore();
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const perPage = 6;
const page = ref(1);
const isLoading = ref(true);

onBeforeMount(async () => {
  getWorkspaces(1);
});

const { sortedItems } = defineComputed({
  // @TODO include "createdAt" in IWorkspaceDTO and sort here (if not pinned)
  sortedItems() {
    return sortArrayByPinnedAt(workspacesStore.items);
  },
});

function open(workspace: IWorkspaceDTO) {
  workspacesStore.setActiveItem(workspace);

  router.push({
    path: `${ROUTE_WORKSPACES_NAME}/${workspace.slug}/${BLUEPRINTS_TAB}`,
  });
}

async function getWorkspaces(newPage: number) {
  page.value = newPage;

  isLoading.value = true;

  try {
    await workspacesStore.getAll({
      page: newPage,
      perPage,
      filters: {},
    });
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(
      "There was an error when trying to load workspaces."
    );
  } finally {
    isLoading.value = false;
  }
}

// @NOTE consider extracting to helper (?)
function toggleAddEditWorkspaceDrawer(newItemToEdit?: IWorkspaceDTO) {
  const isSameItemToEdit = !!(
    workspacesStore.itemToEdit?.id === newItemToEdit?.id
  );

  workspacesStore.itemToEdit = newItemToEdit ? cloneDeep(newItemToEdit) : null;

  if (
    !isSameItemToEdit &&
    drawerStore.isDrawerActive(Drawer.AddEditWorkspace)
  ) {
    return;
  }

  drawerStore.setActiveDrawer(Drawer.AddEditWorkspace);
}

onSocketReceiveMessage(({ action, data }) => {
  if (
    action ===
    authStore.SOCKET_MESSAGE_TYPE.VIEW_DASHBOARD.ACTIONS.UPDATE_WORKSPACE
  ) {
    workspacesStore.onUpdate(data as unknown as UpdateWorkspaceData);

    return;
  }

  if (
    action ===
    authStore.SOCKET_MESSAGE_TYPE.VIEW_DASHBOARD.ACTIONS.CREATE_WORKSPACE
  ) {
    if (page.value === 1) {
      getWorkspaces(1);
    }

    return;
  }
});
</script>
