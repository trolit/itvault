<template>
  <div class="login-page page">
    <n-card>
      <brand>
        <template #extra-text>
          Your tool <icon :value="DotMarkIcon" /> Your data
          <icon :value="DotMarkIcon" /> Our experience
        </template>
      </brand>

      <n-divider />

      <div class="form-wrapper">
        <login-form />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { NCard, NDivider } from "naive-ui";
import { DotMark as DotMarkIcon } from "@vicons/carbon";

import { useAuthStore } from "@/store/auth";
import Icon from "@/components/common/Icon.vue";
import Brand from "@/components/common/Brand.vue";
import LoginForm from "@/components/login/Form.vue";
import { ROUTE_DASHBOARD_NAME } from "@/assets/constants/routes";

const router = useRouter();

onMounted(async () => {
  const authStore = useAuthStore();

  try {
    await authStore.status();

    router.push({ name: ROUTE_DASHBOARD_NAME });
  } catch (error) {
    console.error(error);
  }
});
</script>
