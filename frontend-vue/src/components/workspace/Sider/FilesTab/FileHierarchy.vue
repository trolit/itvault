<template>
  <div>
    <n-tree
      show-line
      :draggable="authStore.hasPermission(Permission.MoveFiles)"
      block-line
      expand-on-click
      :data="workspacesStore.treeData"
      :expanded-keys="workspacesStore.treeDataExpandedKeys"
      check-strategy="child"
      :node-props="nodeProps"
      :on-load="onDirectoryLoad"
      :selected-keys="selectedKeys"
      :on-update:expanded-keys="updatePrefixOnToggle"
      @drop="currentTreeDropInfo = $event"
    />

    <move-files-modal
      v-if="currentTreeDropInfo"
      :is-visible="true"
      :tree-drop-info="currentTreeDropInfo"
      @update:is-visible="currentTreeDropInfo = null"
    />
  </div>
</template>

<script setup lang="ts">
import { h, ref, type Ref } from "vue";
import { NTree, NIcon, type TreeOption, type TreeDropInfo } from "naive-ui";

import {
  Folder as OpenedFolderIcon,
  FolderOff as ClosedFolderIcon,
} from "@vicons/carbon";
import isFile from "@/helpers/isFile";
import { useAuthStore } from "@/store/auth";
import { useFilesStore } from "@/store/files";
import isDirectory from "@/helpers/isDirectory";
import { useWorkspacesStore } from "@/store/workspaces";
import { defineComputed } from "@/helpers/defineComputed";
import { Permission } from "@shared/types/enums/Permission";
import createFileTreeOption from "@/helpers/createFileTreeOption";
import createFolderTreeOption from "@/helpers/createFolderTreeOption";
import MoveFilesModal from "@/components/workspace/Sider/FilesTab/MoveFilesModal.vue";

const authStore = useAuthStore();
const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

const currentTreeDropInfo: Ref<TreeDropInfo | null> = ref(null);

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

  if (node.key && ["collapse", "expand"].includes(action)) {
    workspacesStore.toggleTreeDir(node.key.toString());
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

function onDirectoryLoad(node: TreeOption) {
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
