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
import { h, ref, type Component, watch } from "vue";
import { Catalog as WorkspaceIcon } from "@vicons/carbon";
import { useRoute, type RouteRecordName } from "vue-router";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

// const about: MenuOption = {
//   label: () =>
//     h(
//       RouterLink,
//       {
//         to: {
//           name: "about",
//           params: {},
//         },
//       },
//       { default: () => "About" }
//     ),
//   key: "introduction",
//   icon: renderIcon(AboutIcon),
// };

const menuOptions: MenuOption[] = [
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
