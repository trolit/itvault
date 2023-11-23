<template>
  <n-modal
    :show="isVisible"
    segmented
    :title="`Move ${sourceType}`"
    preset="card"
    :bordered="true"
    :closable="!isLoading"
    :close-on-esc="false"
    :mask-closable="false"
    :style="{ width: '600px' }"
    @close="close"
  >
    <div class="text-center">
      <n-space vertical>
        <n-row>
          <n-col :span="24">
            <n-text v-if="!isConfirmDisabledDueToNotUniqueFilename">
              You are about to relocate "{{ sourceType }}":
            </n-text>

            <n-text v-else>
              Can't perform requested relocation because at
              '${targetRelativePath}' there is already file with such name:
            </n-text>
          </n-col>

          <n-col :span="24">
            <n-text :depth="3"> {{ sourceLabel }} </n-text>
          </n-col>
        </n-row>

        <div>
          <n-row>
            <n-col :span="24">(from)</n-col>
          </n-row>

          <n-row>
            <n-col :span="24">
              <n-text :depth="3">{{ sourceRelativePath }}</n-text>
            </n-col>
          </n-row>
        </div>

        <div>
          <n-row>
            <n-col :span="24">(to)</n-col>
          </n-row>

          <n-row>
            <n-col :span="24">
              <n-text :depth="3" type="warning">
                {{ targetRelativePath }}

                <span v-if="targetRelativePath === filesStore.ROOT">
                  (root)
                </span>
              </n-text>
            </n-col>
          </n-row>
        </div>
      </n-space>
    </div>

    <template #footer>
      <n-space justify="space-between">
        <n-button @click="close" :disabled="isLoading"> Cancel </n-button>

        <n-button
          type="warning"
          :disabled="isConfirmDisabledDueToNotUniqueFilename"
          :loading="isLoading"
          @click="onConfirm"
        >
          Confirm
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NCol,
  NRow,
  NText,
  NModal,
  NSpace,
  NButton,
  type TreeDropInfo,
} from "naive-ui";
import { ref, toRefs } from "vue";

import isFile from "@/helpers/isFile";
import { useFilesStore } from "@/store/files";
import isDirectory from "@/helpers/isDirectory";
import { useGeneralStore } from "@/store/general";
import { useWorkspacesStore } from "@/store/workspaces";
import { useDirectoriesStore } from "@/store/directories";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

interface IProps {
  isVisible: boolean;

  treeDropInfo: TreeDropInfo;
}

const filesStore = useFilesStore();
const generalStore = useGeneralStore();
const workspacesStore = useWorkspacesStore();
const directoriesStore = useDirectoriesStore();

const props = defineProps<IProps>();

const emits = defineEmits(["update:is-visible"]);

const isLoading = ref(false);
const { treeDropInfo } = toRefs(props);

const {
  dropPosition,
  node: { key: nodeKey },
  dragNode: { key: dragNodeKey },
} = treeDropInfo.value;

let sourceId = 0;
let sourceType = "";
let sourceLabel = "";
let sourceRelativePath = "";
let isSourceFile = false;

let targetId = 0;
let targetRelativePath = "";
let isTargetFile = false;

let isConfirmDisabledDueToNotUniqueFilename = false;

if (dragNodeKey) {
  const [type, id] = dragNodeKey.toString().split("-");

  isSourceFile = type === "file";

  sourceId = parseInt(id);
  sourceType = type;
  sourceLabel = treeDropInfo.value.dragNode.label || "";

  const item = workspacesStore.tree.find(
    elem =>
      elem.id == sourceId && (isSourceFile ? isFile(elem) : isDirectory(elem))
  );

  if (item) {
    sourceRelativePath = item.relativePath;
  }
}

if (nodeKey) {
  processNodeKey(nodeKey.toString());
}

function close() {
  emits("update:is-visible", false);
}

function processNodeKey(nodeKey: string) {
  const [type, id] = nodeKey.split("-");

  isTargetFile = type === "file";

  if (dropPosition === "inside") {
    handleInsideDrop(id);

    return;
  }

  handleBeforeOrAfterDrop(id);
}

function handleBeforeOrAfterDrop(id: string) {
  const itemIndex = workspacesStore.tree.findIndex(
    elem =>
      elem.id == parseInt(id) &&
      (isSourceFile ? isFile(elem) : isDirectory(elem))
  );

  const item = workspacesStore.tree[itemIndex];

  if (!item) {
    return;
  }

  if (
    (itemIndex === 0 && dropPosition === "before") ||
    (itemIndex === workspacesStore.tree.length - 1 && dropPosition === "after")
  ) {
    targetId = 1;
    targetRelativePath = filesStore.ROOT;

    checkIfTargetNameIsUnique();

    return;
  }

  if (itemIndex === 1) {
    targetId = item.id;
    targetRelativePath = item.relativePath;

    checkIfTargetNameIsUnique();

    return;
  }

  const truePath = isTargetFile
    ? item.relativePath
    : item.relativePath.split("/").slice(0, -1).join("/");

  const truePathItem = workspacesStore.tree.find(
    elem => elem.relativePath === truePath && isDirectory(elem)
  );

  if (truePathItem) {
    targetId = truePathItem.id;
    targetRelativePath = truePathItem.relativePath;

    checkIfTargetNameIsUnique();
  }
}

function checkIfTargetNameIsUnique() {
  if (!isTargetFile) {
    return;
  }

  const item: IDirectoryDto | IFileDto | undefined = workspacesStore.tree.find(
    elem => elem.relativePath === targetRelativePath && isFile(elem)
  );

  isConfirmDisabledDueToNotUniqueFilename = !!item;
}

function handleInsideDrop(id: string) {
  targetId = parseInt(id);

  const item: IDirectoryDto | IFileDto | undefined = workspacesStore.tree.find(
    elem => elem.id == targetId && isDirectory(elem)
  );

  if (item) {
    targetRelativePath = item.relativePath;
  }
}

async function onConfirm() {
  isLoading.value = true;

  try {
    isSourceFile
      ? await filesStore.patchRelativePath(sourceId, targetRelativePath)
      : await directoriesStore.moveFiles({
          sourceDirectoryId: sourceId,
          targetDirectoryId: targetId,
        });

    generalStore.messageProvider.success(
      `Operation successful. Please reload page (until there is no sockets :/)`
    );

    close();
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(`Operation failed`);
  } finally {
    isLoading.value = false;
  }
}
</script>
