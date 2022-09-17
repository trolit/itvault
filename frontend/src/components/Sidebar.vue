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
import { DocumentUnknown as IntroductionIcon } from "@vicons/carbon";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const introduction: MenuOption = {
  label: () =>
    h(
      RouterLink,
      {
        to: {
          name: "introduction",
          params: {},
        },
      },
      { default: () => "Introduction" }
    ),
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
