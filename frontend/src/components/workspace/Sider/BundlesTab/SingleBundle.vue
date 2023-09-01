<template>
  <n-card>
    <n-thing content-indented class="single-bundle">
      <template #header>
        <div>Bundle #{{ item.id }}</div>

        <status :value="item.status" />
      </template>

      <template v-if="isReady" #description>
        <small>expires {{ dateService.fromNow(item.expiresAt) }}</small>
      </template>

      <n-card>
        <n-ellipsis v-if="item.note" :line-clamp="2">
          {{ item.note }}
        </n-ellipsis>

        <em v-else>No note provided</em>
      </n-card>

      <template #footer>
        <!-- @TODO delete action + permission (+allow to delete for bundle owners (?)) -->
        <n-button type="error" ghost size="small" @click.stop>delete</n-button>

        <!-- @TODO allow to requeue bundle for bundle owners (?) -->
        <require-permission :permission="Permission.RequeueBundle">
          <!-- @TODO -->
          <n-button
            v-if="isBundleGenerationFailed"
            type="warning"
            ghost
            size="small"
            @click.stop="requeueBundle"
          >
            requeue
          </n-button>
        </require-permission>

        <!-- @TODO  -->
        <require-permission :permission="Permission.DownloadBundle">
          <!-- @TODO -->
          <n-button
            v-if="isReady"
            type="info"
            ghost
            size="small"
            :loading="isProcessingDownloadRequest"
            @click.stop="downloadBundle"
          >
            download
          </n-button>
        </require-permission>
      </template>
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";
import { NCard, NThing, NButton, NEllipsis, useLoadingBar } from "naive-ui";

import Status from "./Status.vue";
import { useBundlesStore } from "@/store/bundles";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";
import { BundleStatus as BundleStatusEnum } from "@shared/types/enums/BundleStatus";

const loadingBar = useLoadingBar();
const dateService = useDateService();
const bundlesStore = useBundlesStore();

const props = defineProps({
  item: {
    type: Object as PropType<IBundleDto>,
    required: true,
  },
});

const emit = defineEmits(["set-status"]);

const isProcessingRequeueRequest = ref(false);
const isProcessingDownloadRequest = ref(false);

const item = computed(() => props.item);
const isReady = computed(() => item.value.status === BundleStatusEnum.Ready);

const isBundleGenerationFailed = computed(
  () => item.value.status === BundleStatusEnum.Failed
);

async function requeueBundle() {
  isProcessingRequeueRequest.value = true;

  loadingBar.start();

  try {
    await bundlesStore.requeue(props.item.id);

    emit("set-status", BundleStatusEnum.Queried);

    loadingBar.finish();
  } catch (error) {
    console.log(error);

    loadingBar.error();
  } finally {
    isProcessingRequeueRequest.value = false;
  }
}

async function downloadBundle() {
  isProcessingDownloadRequest.value = true;

  loadingBar.start();

  try {
    const data = await bundlesStore.download(props.item.id);

    const url = window.URL.createObjectURL(new Blob([data]));

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", props.item.filename || "unknown.zip");

    link.click();

    link.remove();

    loadingBar.finish();
  } catch (error) {
    console.log(error);

    loadingBar.error();
  } finally {
    isProcessingDownloadRequest.value = false;
  }
}
</script>
