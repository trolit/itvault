<template>
  <n-thing content-indented class="single-bundle">
    <template #header>
      <div>
        <n-alert
          v-if="!isReady"
          :type="!isReady && isBundleGenerationFailed ? 'error' : 'warning'"
        >
          {{ alertMessage }}
        </n-alert>

        <n-gradient-text v-else type="warning" :size="18">
          (128B)
        </n-gradient-text>
      </div>
    </template>

    <template #description>
      <n-tag v-if="isReady" size="small">
        expires {{ formatDate(item.expiresAt, "DD-MM-YYYY HH:mm") }}
      </n-tag>

      <n-tag size="small">owner: {{ item.createdBy.fullName }}</n-tag>
    </template>

    <n-card>
      {{ item.note }}
    </n-card>

    <template #footer>
      <!-- @TODO -->
      <n-button type="error" ghost size="small">delete</n-button>

      <!-- @TODO -->
      <n-button v-if="isBundleGenerationFailed" type="info" ghost size="small">
        requeue
      </n-button>

      <!-- @TODO -->
      <n-button v-if="isReady" type="success" ghost size="small">
        download
      </n-button>
    </template>
  </n-thing>
</template>

<script setup lang="ts">
import { computed, type PropType } from "vue";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";
import { NThing, NButton, NTag, NGradientText, NAlert, NCard } from "naive-ui";

import formatDate from "@/helpers/dayjs/formatDate";
import { BundleStatus } from "@shared/types/enums/BundleStatus";

const props = defineProps({
  item: {
    type: Object as PropType<IBundleDto>,
    required: true,
  },
});

const item = computed(() => props.item);

const isReady = computed(() => item.value.status === BundleStatus.Ready);

const isBundleGenerationFailed = computed(
  () => item.value.status === BundleStatus.Failed
);

// @TODO adjust error message - depending on isPermissionEnabled
const alertMessage = computed(() =>
  isBundleGenerationFailed.value
    ? "Some issue occured when trying to generate bundle. "
    : `Bundle status: '${item.value.status}'`
);
</script>
