<template>
  <div class="files-tab">
    <div class="header">
      <n-button type="info" size="small" dashed>
        <n-icon :component="ResetIcon" :size="20" />
      </n-button>

      <!-- @TODO create common component -->
      <n-input clearable show-count placeholder="Type name or color">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>
    </div>

    <n-scrollbar>
      <n-tree
        v-if="!isLoading"
        block-line
        expand-on-click
        :data="data"
        :node-props="nodeProps"
        :on-update:expanded-keys="updatePrefixWithExpaned"
      />

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref, computed } from "vue";
import {
  NTree,
  NIcon,
  NInput,
  NButton,
  NScrollbar,
  NSpin,
  TreeOption,
} from "naive-ui";

import {
  Reset as ResetIcon,
  Search as SearchIcon,
  Document as FileIcon,
  Folder as OpenedFolderIcon,
  FolderOff as ClosedFolderIcon,
} from "@vicons/carbon";
import { useFilesStore } from "@/stores/file";

const isLoading = ref(false);
const filesStore = useFilesStore();

onMounted(() => {
  if (filesStore.items.length === 0) {
    getFilesByRelativePath();
  }
});

const updatePrefixWithExpaned = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: "expand" | "collapse" | "filter";
  }
) => {
  if (!meta.node) return;
  switch (meta.action) {
    case "expand":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(OpenedFolderIcon),
        });
      break;
    case "collapse":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(ClosedFolderIcon),
        });
      break;
  }
};

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      if (!option.children && !option.disabled) {
        console.log(option);
      }
    },
  };
};

const data = computed((): TreeOption[] => {
  const { items } = filesStore;

  const uniqueRelativePaths = [
    ...new Set(items.map(({ relativePath }) => relativePath)),
  ];

  const result: TreeOption[] = [];

  for (const relativePath of uniqueRelativePaths) {
  }

  return [];
});

// const data = [
//   {
//     key: "Folder",
//     label: "Folder",
//     prefix: () =>
//       h(NIcon, null, {
//         default: () => h(ClosedFolderIcon),
//       }),
//     children: [
//       {
//         key: "Empty",
//         label: "Empty",
//         disabled: true,
//         prefix: () =>
//           h(NIcon, null, {
//             default: () => h(ClosedFolderIcon),
//           }),
//       },
//       {
//         key: "MyFiles",
//         label: "MyFiles",
//         prefix: () =>
//           h(NIcon, null, {
//             default: () => h(ClosedFolderIcon),
//           }),
//         children: [
//           {
//             label: "template.txt",
//             key: "template.txt",
//             prefix: () =>
//               h(NIcon, null, {
//                 default: () => h(FileIcon),
//               }),
//           },
//         ],
//       },
//     ],
//   },
// ];

// @TODO handle infinite scroll
async function getFilesByRelativePath() {
  isLoading.value = true;

  try {
    await filesStore.getAllBy({ relativePath: "." });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
