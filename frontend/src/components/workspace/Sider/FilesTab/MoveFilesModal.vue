<template>
  <n-modal
    :show="isVisible"
    segmented
    :title="`Move ${sourceType}`"
    preset="card"
    :bordered="true"
    :mask-closable="false"
    :style="{ width: '600px' }"
    @close="close"
  >
    <div class="text-center">
      <n-space vertical>
        <n-row>
          <n-col :span="24">
            <n-text> You are about to relocate "{{ sourceType }}": </n-text>
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
              <n-text :depth="3" type="warning">{{
                targetRelativePath
              }}</n-text>
            </n-col>
          </n-row>
        </div>
      </n-space>
    </div>

    <template #footer>
      <n-space justify="space-between">
        <n-button @click="close"> Cancel </n-button>

        <n-button type="warning"> Confirm </n-button>
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
import { toRefs } from "vue";

import isFile from "@/helpers/isFile";
import isDirectory from "@/helpers/isDirectory";
import { useWorkspacesStore } from "@/store/workspaces";
import type { IFileDto } from "@shared/types/dtos/IFileDto";
import type { IDirectoryDto } from "@shared/types/dtos/IDirectoryDto";

interface IProps {
  isVisible: boolean;

  treeDropInfo: TreeDropInfo;
}

const workspacesStore = useWorkspacesStore();

const props = defineProps<IProps>();

const emits = defineEmits(["update:is-visible"]);

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
  const isBefore = dropPosition === "before";

  const itemIndex = workspacesStore.tree.findIndex(
    elem =>
      elem.id == parseInt(id) &&
      (isTargetFile ? isFile(elem) : isDirectory(elem))
  );

  const item = workspacesStore.tree[itemIndex];

  if (!item) {
    return;
  }

  if (itemIndex === 0 && isBefore) {
    targetId = 1;
    targetRelativePath = ". (root)";

    return;
  }

  if (itemIndex === 1) {
    targetId = item.id;
    targetRelativePath = item.relativePath;

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
  }
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
</script>
