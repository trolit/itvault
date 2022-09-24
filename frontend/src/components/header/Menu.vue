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
import { NMenu } from "naive-ui";
import { RouterLink } from "vue-router";
import { h, ref, type VNode } from "vue";
import type { MenuOption } from "naive-ui";
import renderIcon from "@/helpers/renderIcon";

import {
  Help as HelpIcon,
  UpdateNow as UpdatesIcon,
  InformationSquare as AboutIcon,
} from "@vicons/carbon";

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
    label: renderLabel("welcome", "Home"),
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
        label: renderLabel("about", "About app"),
        key: "about",
        icon: renderIcon(AboutIcon),
      },
      {
        label: renderLabel("guide", "Guide"),
        key: "guide",
        icon: renderIcon(HelpIcon),
      },
      {
        label: renderLabel("updates", "Updates"),
        key: "updates",
        icon: renderIcon(UpdatesIcon),
      },
    ],
  },
];
</script>
