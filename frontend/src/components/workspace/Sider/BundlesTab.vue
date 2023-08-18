<template>
  <div class="bundles-tab">
    <div class="header">
      <n-button type="warning" size="small">
        <n-icon :component="ResetIcon" :size="20" />
      </n-button>

      <!-- @TODO create common component -->
      <n-input clearable show-count placeholder="Type note or status">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <n-button type="info" size="small" dashed>
        <n-icon :component="AddIcon" :size="25" />
      </n-button>
    </div>

    <n-scrollbar>
      <div v-if="!isLoading">
        <n-empty v-if="!items.length" />

        <n-list v-else>
          <n-list-item v-for="item in items" :key="item.id">
            <single-bundle />
          </n-list-item>
        </n-list>
      </div>

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import {
  Add as AddIcon,
  Reset as ResetIcon,
  Search as SearchIcon,
} from "@vicons/carbon";
import { computed, onMounted, ref } from "vue";
import {
  NIcon,
  NInput,
  NButton,
  NSpin,
  NScrollbar,
  NEmpty,
  NList,
  NListItem,
} from "naive-ui";

import SingleBundle from "./SingleBundle.vue";
import { useBundlesStore } from "@/store/bundles";

const page = ref(1);
const isLoading = ref(false);
const bundlesStore = useBundlesStore();

onMounted(() => {
  if (bundlesStore.total === 0) {
    getBundles();
  }
});

async function getBundles() {
  isLoading.value = true;

  try {
    await bundlesStore.getAll({ page: page.value });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

const items = computed(() => bundlesStore.items);
</script>
