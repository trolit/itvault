<template>
  <n-dropdown
    :width="250"
    trigger="click"
    :options="options"
    @select="handleSelect"
    data-cy="workspace-dropdown"
  >
    <n-button quaternary>
      {{ workspacesStore.activeItem.name }}
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
import {
  Box as FilesIcon,
  ChartRose as InsightsIcon,
  Workspace as WorkspaceIcon,
} from "@vicons/carbon";
import { computed } from "vue";
import { NDropdown, NButton } from "naive-ui";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "@/store/auth";
import renderIcon from "@/helpers/renderIcon";
import { BLUEPRINTS_TAB } from "@/config/constants";
import { useWorkspacesStore } from "@/store/workspaces";
import { Permission } from "@shared/types/enums/Permission";
import { ROUTE_WORKSPACES_NAME } from "@/assets/constants/routes";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const workspacesStore = useWorkspacesStore();

const emit = defineEmits(["change-workspace"]);

const options = computed(() => [
  {
    label: "Change",
    key: "change-workspace",
    icon: renderIcon(WorkspaceIcon),
  },
  {
    label: "View insights",
    key: "insights",
    icon: renderIcon(InsightsIcon),
    show:
      route.params.section !== "insights" &&
      authStore.hasPermission(Permission.ViewWorkspaceInsights),
  },
  {
    label: "View data",
    key: "data",
    icon: renderIcon(FilesIcon),
    show: route.params.section === "insights",
  },
]);

function handleSelect(key: "change-workspace" | "insights" | "data") {
  if (key === "change-workspace") {
    emit("change-workspace");

    return;
  }

  if (key === "data") {
    router.push({
      name: ROUTE_WORKSPACES_NAME,
      params: {
        slug: workspacesStore.activeItem.slug,
        section: workspacesStore.generalLayoutSiderKey || BLUEPRINTS_TAB,
      },
    });

    return;
  }

  if (key === "insights") {
    router.push({
      name: ROUTE_WORKSPACES_NAME,
      params: { slug: workspacesStore.activeItem.slug, section: "insights" },
    });
  }
}
</script>
