<template>
  <div class="menu">
    <n-menu
      v-model:value="activeKey"
      mode="horizontal"
      :options="menuOptions"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Help as HelpIcon,
  UpdateNow as UpdatesIcon,
  InformationSquare as AboutIcon,
} from "@vicons/carbon";
import { NMenu } from "naive-ui";
import { RouterLink } from "vue-router";
import { h, ref, type VNode } from "vue";
import type { MenuOption } from "naive-ui";
import renderIcon from "@/helpers/renderIcon";

import {
  ROUTE_ABOUT_NAME,
  ROUTE_GUIDE_NAME,
  ROUTE_UPDATES_NAME,
  ROUTE_DASHBOARD_NAME,
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
    label: "Help",
    key: "help",
    children: [
      {
        label: renderLabel(ROUTE_ABOUT_NAME, "About app"),
        key: ROUTE_ABOUT_NAME,
        icon: renderIcon(AboutIcon),
      },
      {
        label: renderLabel(ROUTE_GUIDE_NAME, "Guide"),
        key: ROUTE_GUIDE_NAME,
        icon: renderIcon(HelpIcon),
      },
      {
        label: renderLabel(ROUTE_UPDATES_NAME, "Updates"),
        key: ROUTE_UPDATES_NAME,
        icon: renderIcon(UpdatesIcon),
      },
    ],
  },
];
</script>
