<template>
  <div class="sign-up-page page">
    <theme-selector>
      <template #default>
        <n-button text :focusable="false" class="theme-selector">
          <n-icon :component="RainDropIcon" :size="40" />
        </n-button>
      </template>
    </theme-selector>

    <n-card>
      <n-scrollbar trigger="none">
        <n-grid
          x-gap="30"
          y-gap="30"
          responsive="screen"
          cols="1 s:1 m:8 l:8 xl:8 2xl:8"
        >
          <n-grid-item span="4" class="section">
            <sign-up-banner :email="email" />
          </n-grid-item>

          <n-grid-item span="4" class="section">
            <sign-up-form :id="id" :email="email" :code="code" />
          </n-grid-item>
        </n-grid>
      </n-scrollbar>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { RainDrop as RainDropIcon } from "@vicons/carbon";
import { NCard, NGrid, NGridItem, NIcon, NButton, NScrollbar } from "naive-ui";

import SignUpForm from "@/components/users/sign-up/Form.vue";
import SignUpBanner from "@/components/users/sign-up/Banner.vue";
import ThemeSelector from "@/components/common/ThemeSelector.vue";

const route = useRoute();
const router = useRouter();

const id = ref("");
const code = ref("");
const email = ref("");

onBeforeMount(() => {
  const {
    query: { email: qEmail, id: qId, code: qCode },
  } = route;

  if (!qEmail || !qId || !qCode) {
    router.back();

    return;
  }

  id.value = qId.toString();
  code.value = qCode.toString();
  email.value = qEmail.toString();
});
</script>
