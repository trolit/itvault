<template>
  <n-drawer
    :show="isVisible"
    resizable
    :default-height="300"
    :min-height="300"
    placement="bottom"
    :show-mask="false"
    :trap-focus="false"
    to="#notes-drawer-content"
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

  userToEdit: IUserDto | null;
}

const props = defineProps<IProps>();

const emits = defineEmits(["close"]);

const { isVisible } = toRefs(props);

const isLoading = ref(false);
</script>
