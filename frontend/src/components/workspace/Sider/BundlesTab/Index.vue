<template>
  <div class="bundles-tab">
    <toolbar
      input-placeholder="Type note or status"
      @add-item="isCreateBundleModalVisible = true"
    />

    <n-scrollbar>
      <div v-if="!isLoading">
        <n-empty v-if="!items.length" />

        <n-list :show-divider="false" v-else>
          <n-list-item
            v-for="item in items"
            :key="item.id"
            @click="bundlesStore.showDetailsDrawer(item.id)"
          >
            <single-bundle :item="item" @set-status="item.status = $event" />
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
        @update:page="onPageChange"
      />
    </div>

    <create-bundle-modal v-model:show="isCreateBundleModalVisible" />
  </div>
</template>

<script setup lang="ts">
import {
  NSpin,
  NList,
  NEmpty,
  NListItem,
  NScrollbar,
  NPagination,
} from "naive-ui";
import { computed, onMounted, ref, type PropType, toRefs } from "vue";

import SingleBundle from "./SingleBundle.vue";
import { useBundlesStore } from "@/store/bundles";
import CreateBundleModal from "./CreateBundleModal/Index.vue";
import Toolbar from "@/components/workspace/Sider/Toolbar.vue";

const props = defineProps({
  page: {
    type: Object as PropType<number>,
    required: true,
  },
});

const emit = defineEmits(["update:page"]);

const perPage = 10;
const isLoading = ref(false);
const { page } = toRefs(props);
const bundlesStore = useBundlesStore();
const isCreateBundleModalVisible = ref(false);

onMounted(() => {
  if (bundlesStore.total === 0) {
    getBundles(page.value);
  }
});

function onPageChange(newPage: number) {
  emit("update:page", newPage);

  getBundles(newPage);
}

async function getBundles(page: number) {
  isLoading.value = true;

  try {
    await bundlesStore.getAll({ page, perPage });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

const items = computed(() => bundlesStore.items);
</script>
