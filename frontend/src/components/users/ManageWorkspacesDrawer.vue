<template>
  <n-drawer
    :show="isVisible"
    resizable
    :min-width="400"
    :default-width="400"
    placement="right"
    :show-mask="false"
    :trap-focus="false"
  >
    <n-drawer-content
      :footer-style="{
        display: 'flex',
        margin: '0 10px',
        justifyContent: 'space-between',
      }"
    >
      <!-- @TODO -->

      <template #footer>
        <n-button secondary :loading="isLoading" @click="$emit('close')">
          Cancel
        </n-button>

        <n-button
          type="info"
          secondary
          :loading="isLoading"
          :disabled="isLoading"
        >
          Save
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { NButton, NDrawer, NDrawerContent } from "naive-ui";

import type { IUserDto } from "@shared/types/dtos/IUserDto";

interface IProps {
  isVisible: boolean;

  user: IUserDto | null;
}

const props = defineProps<IProps>();

const emits = defineEmits(["close"]);

const { isVisible } = toRefs(props);

const isLoading = ref(false);
</script>
