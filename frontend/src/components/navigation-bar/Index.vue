<template>
  <n-layout class="navigation-bar" has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger
    >
      <n-menu
        v-model:value="activeKey"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>

    <n-layout>
      <span>Content</span>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { h, ref, type Component } from "vue";
import { DocumentUnknown as IntroductionIcon } from "@vicons/carbon";

import type { MenuOption } from "naive-ui";
import { NIcon, NMenu, NLayout, NLayoutSider } from "naive-ui";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const introduction: MenuOption = {
  label: "Introduction",
  key: "introduction",
  icon: renderIcon(IntroductionIcon),
};

const menuOptions: MenuOption[] = [
  introduction,
  {
    label: "Pinball 1973",
    key: "pinball-1973",
    disabled: true,
    children: [
      {
        label: "Rat",
        key: "rat",
      },
    ],
  },
  {
    label: "A Wild Sheep Chase",
    key: "a-wild-sheep-chase",
    disabled: true,
  },
  {
    label: "Dance Dance Dance",
    key: "Dance Dance Dance",
    children: [
      {
        type: "group",
        label: "People",
        key: "people",
        children: [
          {
            label: "Narrator",
            key: "narrator",
          },
        ],
      },
      {
        label: "The past increases. The future recedes.",
        key: "the-past-increases-the-future-recedes",
      },
    ],
  },
];

const activeKey = ref<string | null>(null);
</script>
