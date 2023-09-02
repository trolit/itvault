<template>
  <n-tree
    block-line
    expand-on-click
    :data="treeData"
    check-strategy="child"
    :node-props="nodeProps"
    :on-load="onDirectoryLoad"
    :on-update:expanded-keys="updatePrefixOnToggle"
  />
</template>

<script setup lang="ts">
// @TODO HANDLE INITIAL (EMPTY) STATE UPLOAD!
// @TODO HANDLE DRAG (RELATIVE PATH CHANGE)
// @TODO HANDLE FILENAME CHANGE

import sortBy from "lodash/sortBy";
import type { TreeOption } from "naive-ui";
import { NTree, NIcon } from "naive-ui";
import { h, reactive, type PropType, onBeforeMount } from "vue";

import {
  Folder as OpenedFolderIcon,
  FolderOff as ClosedFolderIcon,
} from "@vicons/carbon";
import isFile from "@/helpers/isFile";
import { useFilesStore } from "@/store/files";
import { useWorkspacesStore } from "@/store/workspaces";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import createFileTreeOption from "@/helpers/createFileTreeOption";
import createFolderTreeOption from "@/helpers/createFolderTreeOption";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

const filesStore = useFilesStore();
const treeData: TreeOption[] = reactive([]);
const workspacesStore = useWorkspacesStore();

const props = defineProps({
  data: {
    type: Array as PropType<(IFileDto | IDirectoryDto)[]>,
    required: true,
  },
});

onBeforeMount(() => {
  restoreTreeData(props.data);
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
      if (!option.children && option.isLeaf) {
        const { key } = option;

        if (!key) {
          return;
        }

        const id = key.toString().split("-").pop();

        if (!id) {
          return;
        }

        const parsedId = parseInt(id);

        const treeElement = workspacesStore.tree.find(
          element => element.id === parsedId
        );

        if (treeElement && isFile(treeElement)) {
          workspacesStore.setFileTab(treeElement);
        }
      }
    },
  };
};

function getUniqueRelativePaths(tree: (IDirectoryDto | IFileDto)[]) {
  const uniqueRelativePaths = [
    ...new Set(tree.map(({ relativePath }) => relativePath)),
  ];

  return sortBy(uniqueRelativePaths);
}

function restoreTreeData(tree: (IDirectoryDto | IFileDto)[]) {
  const uniqueRelativePaths = getUniqueRelativePaths(tree);

  for (const relativePath of uniqueRelativePaths) {
    const splitRelativePath = relativePath.split("/");

    const values = tree.filter(value => value.relativePath === relativePath);

    const isRoot = relativePath === filesStore.ROOT;

    for (const value of values) {
      const isValueFile = isFile(value);

      const treeOptionToAdd = isValueFile
        ? createFileTreeOption(value)
        : createFolderTreeOption(value);

      if (!isValueFile) {
        const hasAnyFile = tree.some(
          value => value.relativePath === relativePath && isFile(value)
        );

        treeOptionToAdd.children = hasAnyFile ? [] : undefined;
      }

      if (isRoot || (!isValueFile && splitRelativePath.length === 2)) {
        treeData.push(treeOptionToAdd);

        continue;
      }

      const [, ...splitRelativePathExceptRoot] = splitRelativePath;

      if (!isValueFile) {
        // take out "leaf" dir because we need to create it
        splitRelativePathExceptRoot.pop();
      }

      let target: TreeOption[] | TreeOption | undefined;

      for (const pathPart of splitRelativePath) {
        target = treeData.find(({ label }) => label === pathPart)?.children;
      }

      if (target && Array.isArray(target)) {
        target.push(treeOptionToAdd);
      }
    }
  }
}

async function onDirectoryLoad(node: TreeOption) {
  const { key } = node;

  const onEarlyFailure = () => {
    node.children = [];
    return Promise.resolve(false);
  };

  if (!key) {
    return onEarlyFailure();
  }

  const id = key.toString().split("-").pop();

  if (!id) {
    return onEarlyFailure();
  }

  const parsedId = parseInt(id);

  const { tree } = workspacesStore;

  const folder = tree.find(element => element.id === parsedId);

  if (!folder) {
    return onEarlyFailure();
  }

  return onLoadMore(node, folder.relativePath);
}

async function onLoadMore(node: TreeOption, relativePath: string) {
  try {
    const result = await workspacesStore.getTree({
      relativePath,
    });

    node.children = result.map(value =>
      value?.originalFilename
        ? createFileTreeOption(value)
        : createFolderTreeOption(value)
    );

    return Promise.resolve();
  } catch (error) {
    console.log(error);

    return Promise.resolve(false);
  }
}
</script>
