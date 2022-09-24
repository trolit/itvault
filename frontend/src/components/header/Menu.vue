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
  ROUTE_ABOUT,
  ROUTE_GUIDE,
  ROUTE_UPDATES,
  ROUTE_WELCOME,
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
    label: renderLabel(ROUTE_WELCOME, "Home"),
    key: "home",
  },
  {
    label: "Workspace",
    key: "workspace",
  },
  {
    label: "Help",
    key: "help",
    children: [
      {
        label: renderLabel(ROUTE_ABOUT, "About app"),
        key: ROUTE_ABOUT,
        icon: renderIcon(AboutIcon),
      },
      {
        label: renderLabel(ROUTE_GUIDE, "Guide"),
        key: ROUTE_GUIDE,
        icon: renderIcon(HelpIcon),
      },
      {
        label: renderLabel(ROUTE_UPDATES, "Updates"),
        key: ROUTE_UPDATES,
        icon: renderIcon(UpdatesIcon),
      },
    ],
  },
];
</script>
