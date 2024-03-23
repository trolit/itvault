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
        <n-popconfirm @positive-click="deleteBundle(item.id)">
          <template #trigger>
            <n-button
              v-if="canRemoveBundle"
              type="error"
              ghost
              size="small"
              :loading="bundleToDeleteId == item.id"
              @click.stop
            >
              {{
                item.status === BundleStatusEnum.Enqueued ? "cancel" : "delete"
              }}
            </n-button>
          </template>

          <small>
            Do you really want to remove this bundle entry? This action cannot
            be undone!
          </small>
        </n-popconfirm>

        <!-- @TODO allow to requeue bundle for bundle owners (?) -->
        <require-permission :permission="Permission.RequeueBundle">
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

        <require-permission :permission="Permission.DownloadBundle">
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
import type { IBundleDTO } from "@shared/types/DTOs/Bundle";
import { NCard, NThing, NButton, NEllipsis, NPopconfirm } from "naive-ui";

import Status from "./Status.vue";
import { useAuthStore } from "@/store/auth";
import { useGeneralStore } from "@/store/general";
import { useBundlesStore } from "@/store/bundles";
import { LoadingState } from "@/types/enums/LoadingState";
import { useDateService } from "@/services/useDateService";
import { Permission } from "@shared/types/enums/Permission";
import RequirePermission from "@/components/common/RequirePermission.vue";
import { BundleStatus as BundleStatusEnum } from "@shared/types/enums/BundleStatus";

const props = defineProps({
  item: {
    type: Object as PropType<IBundleDTO>,
    required: true,
  },
});

const emit = defineEmits(["set-status"]);

const authStore = useAuthStore();
const dateService = useDateService();
const bundlesStore = useBundlesStore();
const generalStore = useGeneralStore();

const { setLoadingState } = generalStore;

const bundleToDeleteId = ref(0);
const isProcessingRequeueRequest = ref(false);
const isProcessingDownloadRequest = ref(false);

const item = computed(() => props.item);
const canRemoveBundle = computed(
  () =>
    props.item.status !== BundleStatusEnum.Building &&
    (authStore.hasPermission(Permission.DeleteAnyBundle) ||
      props.item.createdBy.id === authStore.profile.id)
);
const isReady = computed(() => item.value.status === BundleStatusEnum.Ready);

const isBundleGenerationFailed = computed(
  () => item.value.status === BundleStatusEnum.Failed
);

async function requeueBundle() {
  isProcessingRequeueRequest.value = true;

  setLoadingState(LoadingState.Start);

  try {
    await bundlesStore.requeue(props.item.id);

    emit("set-status", BundleStatusEnum.Enqueued);

    setLoadingState(LoadingState.Finish);
  } catch (error) {
    console.log(error);

    setLoadingState(LoadingState.Error);
  } finally {
    isProcessingRequeueRequest.value = false;
  }
}

async function downloadBundle() {
  isProcessingDownloadRequest.value = true;

  setLoadingState(LoadingState.Start);

  try {
    const data = await bundlesStore.download(props.item.id);

    const url = window.URL.createObjectURL(new Blob([data]));

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", props.item.filename || "unknown.zip");

    link.click();

    link.remove();

    setLoadingState(LoadingState.Finish);
  } catch (error) {
    console.log(error);

    setLoadingState(LoadingState.Error);
  } finally {
    isProcessingDownloadRequest.value = false;
  }
}

async function deleteBundle(id: number) {
  if (bundleToDeleteId.value) {
    return;
  }

  bundleToDeleteId.value = id;

  try {
    await bundlesStore.delete(id);

    generalStore.messageProvider.success("Bundle removed!");
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.success("Failed to remove bundle!");
  } finally {
    bundleToDeleteId.value = 0;
  }
}
</script>
