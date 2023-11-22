<template>
  <n-modal
    :show="isVisible"
    segmented
    title="Move file(s)"
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
            <n-text> You are about to relocate {{ sourceType }}: </n-text>
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
              <n-text :depth="3">{{ targetRelativePath }}</n-text>
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

const nodeKey = treeDropInfo.value.node.key;
const dragNodeKey = treeDropInfo.value.dragNode.key;

let sourceId = 0;
let sourceType = "";
let sourceLabel = "";
let sourceRelativePath = "";

let targetId = 0;
let targetRelativePath = "";

if (dragNodeKey) {
  const [type, id] = dragNodeKey.toString().split("-");

  sourceId = parseInt(id);
  sourceType = type;
  sourceLabel = treeDropInfo.value.dragNode.label || "";

  const item = workspacesStore.tree.find(
    elem =>
      elem.id == sourceId &&
      (sourceType === "file" ? isFile(elem) : isDirectory(elem))
  );

  if (item) {
    sourceRelativePath = item.relativePath;
  }
}

if (nodeKey) {
  const [, id] = nodeKey.toString().split("-");

  targetId = parseInt(id);

  const item: IDirectoryDto | IFileDto | undefined = workspacesStore.tree.find(
    elem => elem.id == targetId && isDirectory(elem)
  );

  if (item) {
    targetRelativePath = item.relativePath;
  }
}

function close() {
  emits("update:is-visible", false);
}
</script>
