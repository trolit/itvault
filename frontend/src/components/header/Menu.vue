<template>
  <div v-if="isWorkspaceRouteActive" class="menu">
    <n-menu
      v-model:value="activeKey"
      mode="horizontal"
      :options="menuOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { NMenu } from "naive-ui";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
import type { MenuOption } from "naive-ui";
import renderIcon from "@/helpers/renderIcon";
import { Help as HelpIcon } from "@vicons/carbon";
import { h, ref, computed, type VNode } from "vue";

import {
  ROUTE_GUIDE_NAME,
  ROUTE_DASHBOARD_NAME,
  ROUTE_WORKSPACE_NAME,
} from "@/assets/constants/routes";

function renderLabel(name: string, text: string): () => VNode {
  return () =>
    h(
      RouterLink,
      {
        to: {
          name,
          params: {},
        },
      },
      { default: () => text }
    );
}

const activeKey = ref<string | null>(null);

const menuOptions: MenuOption[] = [
  {
    label: renderLabel(ROUTE_DASHBOARD_NAME, "Home"),
    key: "home",
  },
  {
    label: "Workspace",
    key: "workspace",
  },
  // @TODO should render "Guide" content in Drawer (right side)
  {
    key: "guide",
    icon: renderIcon(HelpIcon),
    label: renderLabel(ROUTE_GUIDE_NAME, "Guide"),
  },
];

const route = useRoute();

const isWorkspaceRouteActive = computed(
  () => route.name === ROUTE_WORKSPACE_NAME
);
</script>
