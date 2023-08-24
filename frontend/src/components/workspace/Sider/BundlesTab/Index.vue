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

      <n-button size="small" @click="isCreateBundleModalVisible = true">
        <n-icon :component="AddIcon" :size="25" />
      </n-button>
    </div>

    <n-scrollbar>
      <div v-if="!isLoading">
        <n-empty v-if="!items.length" />

        <n-list :show-divider="false" v-else>
          <n-list-item
            v-for="item in items"
            :key="item.id"
            @click="bundlesStore.showDetailsDrawer(item.id)"
          >
            <single-bundle :item="item" />
          </n-list-item>
        </n-list>
      </div>

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>

    <div class="footer">
      <n-pagination
        v-model:page="page"
        size="small"
        :item-count="bundlesStore.total"
        :page-size="perPage"
        :page-slot="6"
      />
    </div>

    <create-bundle-modal v-model:show="isCreateBundleModalVisible" />
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
  NSpin,
  NList,
  NIcon,
  NInput,
  NEmpty,
  NButton,
  NListItem,
  NScrollbar,
  NPagination,
} from "naive-ui";

import SingleBundle from "./SingleBundle.vue";
import { useBundlesStore } from "@/store/bundles";
import CreateBundleModal from "./CreateBundleModal/Index.vue";

const page = ref(1);
const perPage = 10;
const isLoading = ref(false);
const bundlesStore = useBundlesStore();
const isCreateBundleModalVisible = ref(false);

onMounted(() => {
  if (bundlesStore.total === 0) {
    getBundles();
  }
});

async function getBundles() {
  isLoading.value = true;

  try {
    await bundlesStore.getAll({ page: page.value, perPage });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

const items = computed(() => bundlesStore.items);
</script>
