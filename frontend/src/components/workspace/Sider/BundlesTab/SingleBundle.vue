<template>
  <n-card>
    <n-thing content-indented class="single-bundle">
      <template #header>
        <div>Bundle #{{ item.id }}</div>

        <bundle-status :value="item.status" />
      </template>

      <template #description>
        <n-tag v-if="isReady" size="small">
          expires {{ formatDate(item.expiresAt, "DD-MM-YYYY HH:mm") }}
        </n-tag>
      </template>

      <n-card>
        {{ item.note }}
      </n-card>

      <template #footer>
        <!-- @TODO delete action + permission (+allow to delete for bundle owners (?)) -->
        <n-button type="error" ghost size="small" @click.stop>delete</n-button>

        <!-- @TODO allow to requeue bundle for bundle owners (?) -->
        <require-permission :permission="Permission.RequeueBundle">
          <!-- @TODO -->
          <n-button
            v-if="isBundleGenerationFailed"
            type="info"
            ghost
            size="small"
          >
            requeue
          </n-button>
        </require-permission>

        <!-- @TODO  -->
        <require-permission :permission="Permission.DownloadBundle">
          <!-- @TODO -->
          <n-button
            v-if="isReady"
            type="success"
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
import { NThing, NButton, NTag, NCard, useLoadingBar } from "naive-ui";

import BundleStatus from "./BundleStatus.vue";
import { useBundlesStore } from "@/store/bundles";
import formatDate from "@/helpers/dayjs/formatDate";
import { Permission } from "@shared/types/enums/Permission";
import { BundleStatus as BundleStatusEnum } from "@shared/types/enums/BundleStatus";
import RequirePermission from "@/components/common/RequirePermission.vue";

const loadingBar = useLoadingBar();
const bundlesStore = useBundlesStore();

const props = defineProps({
  item: {
    type: Object as PropType<IBundleDto>,
    required: true,
  },
});

const isProcessingDownloadRequest = ref(false);

const item = computed(() => props.item);
const isReady = computed(() => item.value.status === BundleStatusEnum.Ready);

const isBundleGenerationFailed = computed(
  () => item.value.status === BundleStatusEnum.Failed
);

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
