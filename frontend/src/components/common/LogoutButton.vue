<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button text @click="onLogout" size="medium" :loading="isLoading">
        <n-icon>
          <logout-icon />
        </n-icon>
      </n-button>
    </template>

    Logout
  </n-tooltip>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessage } from "naive-ui";
import { useRouter } from "vue-router";
import { NTooltip, NIcon, NButton } from "naive-ui";
import { FlashOff as LogoutIcon } from "@vicons/carbon";

import { useAuthStore } from "@/store/auth";
import { ROUTE_LOGIN_NAME } from "@/assets/constants/routes";

const router = useRouter();

const message = useMessage();

const authStore = useAuthStore();

let isLoading = ref<boolean>(false);

const onLogout = async () => {
  isLoading.value = true;

  try {
    await authStore.logout();

    router.push({ name: ROUTE_LOGIN_NAME });
  } catch (error) {
    console.error(error);

    message.warning("Logout failed.");

    isLoading.value = false;
  }
};
</script>
