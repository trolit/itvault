<template>
  <n-tree
    block-line
    expand-on-click
    :data="workspacesStore.treeData"
    check-strategy="child"
    :node-props="nodeProps"
    :on-load="onDirectoryLoad"
    :selected-keys="selectedKeys"
    :on-update:expanded-keys="updatePrefixOnToggle"
  />
</template>

<script setup lang="ts">
// @TODO HANDLE INITIAL (EMPTY) STATE UPLOAD!
// @TODO HANDLE DRAG (RELATIVE PATH CHANGE)
// @TODO HANDLE FILENAME CHANGE

import { h } from "vue";
import { NTree, NIcon, type TreeOption } from "naive-ui";

import {
  Folder as OpenedFolderIcon,
  FolderOff as ClosedFolderIcon,
} from "@vicons/carbon";
import isFile from "@/helpers/isFile";
import { useFilesStore } from "@/store/files";
import isDirectory from "@/helpers/isDirectory";
import { useWorkspacesStore } from "@/store/workspaces";
import createFileTreeOption from "@/helpers/createFileTreeOption";
import createFolderTreeOption from "@/helpers/createFolderTreeOption";
import { defineComputed } from "@/helpers/defineComputed";

const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

const { selectedKeys } = defineComputed({
  selectedKeys() {
    return [`file-${filesStore.activeFileId}`];
  },
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
          element => element.id === parsedId && isFile(element)
        );

        // @TODO redundant check ^^...
        if (treeElement && isFile(treeElement)) {
          filesStore.setActiveTab(treeElement);
        }
      }
    },
  };
};

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

  const folder = tree.find(
    element => element.id === parsedId && isDirectory(element)
  );

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
      isFile(value)
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
