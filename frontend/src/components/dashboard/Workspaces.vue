<template>
  <content-card :icon="WorkspacesIcon" title="Workspaces">
    <template #header-extra>
      <require-permission :permission="Permission.CreateWorkspace">
        <n-button secondary type="info" @click="toggleAddEditWorkspaceDrawer()">
          New workspace
        </n-button>
      </require-permission>
    </template>

    <template #content>
      <!-- @TODO show input only when there are at least 3 pages -->
      <n-input disabled clearable placeholder="Type name or tag to filter">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <n-scrollbar>
        <n-list v-if="!isLoading">
          <n-list-item
            v-for="(item, index) in workspacesStore.items"
            :key="`workspace-${index}`"
          >
            <n-thing :title="item.name">
              <template v-if="item.pinnedAt" #header-extra>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-icon :component="PinIcon" color="#FFFF66" :size="20" />
                  </template>

                  pinned {{ dateService.fromNow(item.pinnedAt) }}
                </n-tooltip>
              </template>

              <template #description>
                <n-space size="small" style="margin-top: 4px">
                  <n-tag
                    size="small"
                    type="success"
                    :key="`tag-${index}`"
                    v-for="(tag, index) in item.tags"
                  >
                    {{ tag }}
                  </n-tag>
                </n-space>
              </template>

              <div :style="{ marginTop: '20px' }">
                <n-text :depth="3">
                  {{ item.description }}
                </n-text>
              </div>

              <n-space justify="end">
                <n-button secondary type="success" @click="open(item)">
                  Open
                </n-button>

                <n-button-group>
                  <require-permission :permission="Permission.UpdateWorkspace">
                    <n-button
                      tertiary
                      @click="toggleAddEditWorkspaceDrawer(item)"
                    >
                      Edit information
                    </n-button>
                  </require-permission>

                  <require-permission :permission="Permission.UpdateWorkspace">
                    <n-button
                      tertiary
                      :loading="pinStatusUpdateItemId === item.id"
                      @click="togglePinStatus(item.id, !!item.pinnedAt)"
                    >
                      {{ item.pinnedAt ? "Unpin" : "Pin" }}
                    </n-button>
                  </require-permission>
                </n-button-group>
              </n-space>
            </n-thing>
          </n-list-item>
        </n-list>

        <loading-section v-else />
      </n-scrollbar>

      <n-pagination
        size="medium"
        :page-slot="6"
        :page="page"
        :page-size="perPage"
        :item-count="workspacesStore.total"
        @update:page="value => getWorkspaces(value)"
      />
    </template>
  </content-card>
</template>

<script setup lang="ts">
import {
  NTag,
  NList,
  NIcon,
  NInput,
  NText,
  NSpace,
  NThing,
  NButton,
  NTooltip,
  NListItem,
  NButtonGroup,
  NScrollbar,
  NPagination,
} from "naive-ui";
import {
  PinFilled as PinIcon,
  Search as SearchIcon,
  Workspace as WorkspacesIcon,
} from "@vicons/carbon";
import { useRouter } from "vue-router";
import cloneDeep from "lodash/cloneDeep";
import { ref, onBeforeMount } from "vue";

import ContentCard from "./ContentCard.vue";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useGeneralStore } from "@/store/general";
import { useWorkspacesStore } from "@/store/workspaces";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import { ROUTE_WORKSPACES_NAME } from "@/assets/constants/routes";
import LoadingSection from "@/components/common/LoadingSection.vue";
import type { IWorkspaceDto } from "@shared/types/dtos/IWorkspaceDto";
import RequirePermission from "@/components/common/RequirePermission.vue";

const router = useRouter();
const dateService = useDateService();
const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();

const perPage = 11;
const page = ref(1);
const isLoading = ref(true);
const pinStatusUpdateItemId = ref(0);

onBeforeMount(async () => {
  getWorkspaces(1);
});

function open(workspace: IWorkspaceDto) {
  workspacesStore.setActiveItem(workspace);

  router.push({ path: `${ROUTE_WORKSPACES_NAME}/${workspace.slug}` });
}

async function getWorkspaces(newPage: number) {
  page.value = newPage;

  isLoading.value = true;

  try {
    await workspacesStore.getAll({
      page: newPage,
      perPage,
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
function toggleAddEditWorkspaceDrawer(newItemToEdit?: IWorkspaceDto) {
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

async function togglePinStatus(id: number, isPinned: boolean) {
  pinStatusUpdateItemId.value = id;

  try {
    isPinned ? await workspacesStore.unpin(id) : await workspacesStore.pin(id);

    if (isPinned) {
      workspacesStore.unpinItem(id);
    } else {
      page.value === 1
        ? workspacesStore.addItemToTheTop(id)
        : workspacesStore.removeItem(id);
    }
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.success(
      `Failed to ${isPinned ? "unpin" : "pin"} workspace!`
    );
  } finally {
    pinStatusUpdateItemId.value = 0;
  }
}
</script>
