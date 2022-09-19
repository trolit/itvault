<template>
  <n-menu
    v-model:value="activeKey"
    :collapsed-width="64"
    :options="menuOptions"
    :collapsed-icon-size="22"
  />
</template>

<script setup lang="ts">
import { NIcon, NMenu } from "naive-ui";
import type { MenuOption } from "naive-ui";
import { RouterLink, useRoute, type RouteRecordName } from "vue-router";
import { h, ref, type Component, watch } from "vue";

import {
  Help as HelpIcon,
  UpdateNow as UpdatesIcon,
  Catalog as WorkspaceIcon,
  InformationSquare as AboutIcon,
} from "@vicons/carbon";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const about: MenuOption = {
  label: () =>
    h(
      RouterLink,
      {
        to: {
          name: "about",
          params: {},
        },
      },
      { default: () => "About" }
    ),
  key: "introduction",
  icon: renderIcon(AboutIcon),
};

const guide: MenuOption = {
  label: () =>
    h(
      RouterLink,
      {
        to: {
          name: "guide",
          params: {},
        },
      },
      { default: () => "Guide" }
    ),
  key: "guide",
  icon: renderIcon(HelpIcon),
};

const updates: MenuOption = {
  label: () =>
    h(
      RouterLink,
      {
        to: {
          name: "updates",
          params: {},
        },
      },
      { default: () => "Updates" }
    ),
  key: "updates",
  icon: renderIcon(UpdatesIcon),
};

const menuOptions: MenuOption[] = [
  about,
  guide,
  updates,
  {
    key: "divider-1",
    type: "divider",
    props: {
      style: {
        height: "0.5px",
        width: "100%",
        marginLeft: "0",
      },
    },
  },
  {
    label: "Vue 2",
    key: "vue-2",
    icon: renderIcon(WorkspaceIcon),
    children: [
      {
        type: "group",
        label: "Colors",
        key: "colors",
        children: [
          {
            label: "[ ] #f1231S",
            key: "narrator",
          },
        ],
      },
    ],
  },
];

let activeKey = ref<string | null>(null);

const route = useRoute();

watch(
  (): RouteRecordName | null | undefined => route.name,
  (name: RouteRecordName | null | undefined): void => {
    if (name === "welcome") {
      activeKey.value = null;
    }
  }
);
</script>
