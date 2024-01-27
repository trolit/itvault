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

import renderIcon from "@/helpers/renderIcon";
import { useWorkspacesStore } from "@/store/workspaces";
import { GENERAL_LAYOUT_SIDER_KEYS } from "@/config/constants";
import { ROUTE_WORKSPACES_NAME } from "@/assets/constants/routes";

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
    show: route.params.section !== "insights",
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
        section:
          workspacesStore.generalLayoutSiderKey ||
          GENERAL_LAYOUT_SIDER_KEYS.BLUEPRINTS_TAB,
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
