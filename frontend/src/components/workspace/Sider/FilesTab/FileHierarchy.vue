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

    <rename-file-modal
      v-if="fileToEditId"
      :is-visible="true"
      :file-id="fileToEditId"
      @update:is-visible="fileToEditId = 0"
    />

    <confirmation-modal
      :is-loading="isDeletingFile"
      :is-visible="isDeleteConfirmationModalVisible"
      :text="removeFileText"
      @confirm="deleteFile"
      @update:is-visible="onDeleteConfirmationModalClose"
    />
  </div>
</template>

<script setup lang="ts">
import {
  NTree,
  NIcon,
  NSpace,
  NButton,
  type TreeOption,
  type TreeDropInfo,
} from "naive-ui";
import { h, ref, type Ref, type VNode } from "vue";

import {
  Pen as EditIcon,
  TrashCan as DeleteIcon,
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
import ConfirmationModal from "@/components/common/ConfirmationModal.vue";
import MoveFilesModal from "@/components/workspace/Sider/FilesTab/MoveFilesModal.vue";
import RenameFileModal from "@/components/workspace/Sider/FilesTab/RenameFileModal.vue";

const authStore = useAuthStore();
const filesStore = useFilesStore();
const workspacesStore = useWorkspacesStore();

const fileToEditId = ref(0);
const hoveredFileId = ref(0);
const fileToDeleteId = ref(0);
const isDeletingFile = ref(false);
const isDeleteConfirmationModalVisible = ref(false);
const currentTreeDropInfo: Ref<TreeDropInfo | null> = ref(null);

const { selectedKeys, removeFileText } = defineComputed({
  selectedKeys() {
    return [`file-${filesStore.activeFileId}`];
  },

  removeFileText() {
    const treeItem = workspacesStore.tree.find(
      item => item.id === fileToDeleteId.value
    );

    return treeItem && isFile(treeItem)
      ? `Do you really want to remove file "${
          treeItem.originalFilename
        }" from "${
          treeItem.relativePath === filesStore.ROOT
            ? "root"
            : `${treeItem.relativePath}`
        }" and it's variants?`
      : "";
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
    onmouseover() {
      const { key } = option;

      if (!key) {
        return;
      }

      const [type, id] = key.toString().split("-");

      if (id && type === "file") {
        hoveredFileId.value = parseInt(id);

        const buttons: VNode[] = [];

        if (authStore.hasPermission(Permission.UpdateFilename)) {
          buttons.push(
            h(
              NButton,
              {
                secondary: true,
                size: "tiny",
                type: "info",
                onClick: event => {
                  event.stopPropagation();

                  fileToEditId.value = parseInt(id);
                },
              },
              {
                default: () => h(NIcon, { component: EditIcon }),
              }
            )
          );
        }

        if (authStore.hasPermission(Permission.DeleteFile)) {
          buttons.push(
            h(
              NButton,
              {
                secondary: true,
                size: "tiny",
                type: "error",
                onClick: event => {
                  event.stopPropagation();

                  fileToDeleteId.value = parseInt(id);

                  isDeleteConfirmationModalVisible.value = true;
                },
              },
              {
                default: () => h(NIcon, { component: DeleteIcon }),
              }
            )
          );
        }

        option.suffix = () =>
          h(
            NSpace,
            { size: 5 },
            {
              default: () => buttons,
            }
          );
      }
    },

    onmouseleave() {
      hoveredFileId.value = 0;

      option.suffix = undefined;
    },

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

function onDeleteConfirmationModalClose() {
  isDeleteConfirmationModalVisible.value = false;

  setTimeout(() => {
    fileToDeleteId.value = 0;
  }, 250);
}

async function deleteFile() {
  isDeletingFile.value = true;

  try {
    await filesStore.delete(fileToDeleteId.value);

    onDeleteConfirmationModalClose();
  } catch (error) {
    console.log(error);
  } finally {
    isDeletingFile.value = false;
  }
}
</script>
