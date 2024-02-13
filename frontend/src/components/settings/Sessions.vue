<template>
  <div>
    <n-space vertical :size="[0, 20]">
      <div>
        <n-h2 :style="{ marginBottom: '5px' }">Your sessions </n-h2>

        <n-tag type="info">Limit per user ({{ MAX_SESSIONS_PER_USER }})</n-tag>
      </div>

      <loading-section v-if="isLoading" spin-size="large" />

      <div v-else>
        <n-space vertical size="large">
          <n-card
            v-for="item of sessions"
            :key="`session-${item.sessionId}`"
            bordered
            title="Mozzila Firefox"
            size="medium"
          >
            <template #header>
              <div>Session #{{ item.sessionId }}</div>

              <n-text :depth="3" :style="{ fontSize: '15px' }">
                issued
                {{ dateService.format(item.issuedAt, "DD-MM-YYYY HH:mm") }}
              </n-text>

              <div>
                <n-text :depth="3" :style="{ fontSize: '13px' }">
                  from {{ item.userAgent }}
                </n-text>
              </div>
            </template>

            <template #header-extra>
              <n-space vertical align="flex-end">
                <n-tag type="info" v-if="item.isRequesterSession">
                  This device session
                </n-tag>

                <n-popconfirm
                  v-if="!item.isRequesterSession"
                  @positive-click="removeSession(item.sessionId)"
                >
                  <template #trigger>
                    <n-button
                      :loading="sessionIdUnderRemove === item.sessionId"
                      :disabled="!!sessionIdUnderRemove"
                      type="error"
                      secondary
                    >
                      Delete
                    </n-button>
                  </template>

                  Are you sure that you want to remove this session?
                </n-popconfirm>
              </n-space>
            </template>
          </n-card>
        </n-space>
      </div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {
  NH2,
  NTag,
  NCard,
  NText,
  NSpace,
  NButton,
  NPopconfirm,
} from "naive-ui";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { onBeforeMount, onUnmounted, ref } from "vue";

import { useAuthStore } from "@/store/auth";
import { useGeneralStore } from "@/store/general";
import { useDateService } from "@/services/useDateService";
import LoadingSection from "@/components/common/LoadingSection.vue";
import { MAX_SESSIONS_PER_USER } from "@shared/constants/config";
import { ROUTE_SETTINGS_NAME } from "@/assets/constants/routes";

const route = useRoute();
const authStore = useAuthStore();
const dateService = useDateService();
const generalStore = useGeneralStore();
const { sessions } = storeToRefs(authStore);

const isLoading = ref(false);
const sessionIdUnderRemove = ref("");

onBeforeMount(() => {
  if (!sessions.value.length) {
    fetchSessions();
  }
});

onUnmounted(() => {
  if (route.name !== ROUTE_SETTINGS_NAME) {
    setTimeout(() => {
      authStore.sessions = [];
    }, 200);
  }
});

async function fetchSessions() {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await authStore.getSessions();
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(`Oops, failed to fetch sessions!`);
  } finally {
    isLoading.value = false;
  }
}

async function removeSession(sessionId: string) {
  sessionIdUnderRemove.value = sessionId;

  try {
    await authStore.deleteSession(sessionId);
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.error(
      `Oops, failed to remove session #${sessionId}!`
    );
  } finally {
    sessionIdUnderRemove.value = "";
  }
}
</script>
