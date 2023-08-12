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
        check-strategy="child"
        :node-props="nodeProps"
        :on-load="onDirectoryLoad"
        :on-update:expanded-keys="updatePrefixOnToggle"
      />

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import type { TreeOption } from "naive-ui";
import { h, onMounted, ref, reactive } from "vue";
import { NTree, NIcon, NInput, NButton, NScrollbar, NSpin } from "naive-ui";

import {
  Reset as ResetIcon,
  Search as SearchIcon,
  Document as FileIcon,
  Folder as OpenedFolderIcon,
  FolderOff as ClosedFolderIcon,
} from "@vicons/carbon";
import { useWorkspacesStore } from "@/stores/workspace";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

const isLoading = ref(false);
const data: TreeOption[] = reactive([]);
const workspacesStore = useWorkspacesStore();

onMounted(() => {
  if (workspacesStore.tree.length === 0) {
    initializeTree();
  }
});

const updatePrefixOnToggle = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: "expand" | "collapse" | "filter";
  }
) => {
  const { node, action } = meta;

  if (!node) {
    return;
  }

  node.prefix = () =>
    h(NIcon, null, {
      default: () =>
        h(action === "expand" ? ClosedFolderIcon : OpenedFolderIcon),
    });
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

function createFolderEntry(folder: IDirectoryDto) {
  const { id, relativePath } = folder;
  const [, ...relativePathExceptRoot] = relativePath.split("/");
  const label = relativePathExceptRoot.pop();

  const folderToAdd: TreeOption = {
    key: `folder-${id}`,
    label,
    isLeaf: false,
    prefix: () =>
      h(NIcon, null, {
        default: () => h(OpenedFolderIcon),
      }),
  };

  return folderToAdd;
}

function createFileEntry(file: IFileDto) {
  const { id, relativePath } = file;

  const fileToAdd: TreeOption = {
    key: `file-${id}-directory-${relativePath}`,
    label: file.originalFilename,
    isLeaf: true,
    children: undefined,
    prefix: () =>
      h(NIcon, null, {
        default: () => h(FileIcon),
      }),
  };

  return fileToAdd;
}

function convertApiResponseToTreeData(result: (IDirectoryDto & IFileDto)[]) {
  return result.map(value =>
    value?.originalFilename ? createFileEntry(value) : createFolderEntry(value)
  );
}

function initializeTreeData(tree: (IDirectoryDto & IFileDto)[]) {
  const uniqueRelativePaths = [
    ...new Set(tree.map(({ relativePath }) => relativePath)),
  ];

  for (const relativePath of uniqueRelativePaths) {
    const values = tree.filter(value => value.relativePath === relativePath);

    data.push(...convertApiResponseToTreeData(values));
  }
}

async function onDirectoryLoad(node: TreeOption) {
  const { key } = node;

  const onFail = () => {
    node.isLeaf = false;
    node.children = [];
    return Promise.resolve(false);
  };

  if (!key) {
    return onFail();
  }

  const id = key.toString().split("-").pop();

  if (!id) {
    return onFail();
  }

  const parsedId = parseInt(id);

  const { tree } = workspacesStore;

  const folder = tree.find(element => element.id === parsedId);

  if (!folder) {
    return onFail();
  }

  try {
    const result = await workspacesStore.getTree({
      relativePath: folder.relativePath,
    });

    node.isLeaf = false;
    node.children = convertApiResponseToTreeData(result);

    return Promise.resolve();
  } catch (error) {
    console.log(error);

    return onFail();
  }
}

async function initializeTree() {
  isLoading.value = true;

  try {
    const result = await workspacesStore.getTree({ relativePath: "." });

    initializeTreeData(result);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
