<template>
  <n-dropdown
    :width="250"
    trigger="click"
    :options="options"
    @select="handleSelect"
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

import {
  ROUTE_INSIGHTS_NAME,
  ROUTE_WORKSPACES_NAME,
} from "@/assets/constants/routes";
import renderIcon from "@/helpers/renderIcon";
import { useWorkspacesStore } from "@/store/workspaces";
import { GENERAL_LAYOUT_SIDER_KEYS } from "@/config/constants";

const route = useRoute();
const router = useRouter();
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
    show: route.name !== ROUTE_INSIGHTS_NAME,
  },
  {
    label: "View data",
    key: "files",
    icon: renderIcon(FilesIcon),
    show: route.name !== ROUTE_WORKSPACES_NAME,
  },
]);

function handleSelect(key: "change-workspace" | "insights" | "files") {
  if (key === "change-workspace") {
    emit("change-workspace");

    return;
  }

  if (key === "files") {
    router.push({
      name: ROUTE_WORKSPACES_NAME,
      params: { tab: GENERAL_LAYOUT_SIDER_KEYS.BLUEPRINTS_TAB },
    });

    return;
  }

  if (key === "insights") {
    router.push({
      name: ROUTE_INSIGHTS_NAME,
    });
  }
}
</script>
