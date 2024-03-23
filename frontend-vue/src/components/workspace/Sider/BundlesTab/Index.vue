<template>
  <div class="bundles-tab">
    <toolbar
      :is-loading="isLoading"
      input-placeholder="Type note or status"
      @add-item="isCreateBundleModalVisible = true"
      @reload="getBundles(page.value)"
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

      <loading-section v-else />
    </n-scrollbar>

    <div class="footer">
      <n-pagination
        size="small"
        :item-count="bundlesStore.total"
        :page="page.value"
        :page-size="perPage"
        :page-slot="6"
        @update:page="onPageChange"
      />
    </div>

    <create-bundle-modal v-model:show="isCreateBundleModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type PropType, type Ref } from "vue";
import { NList, NEmpty, NListItem, NScrollbar, NPagination } from "naive-ui";

import SingleBundle from "./SingleBundle.vue";
import { useBundlesStore } from "@/store/bundles";
import CreateBundleModal from "./CreateBundleModal/Index.vue";
import Toolbar from "@/components/workspace/Sider/Toolbar.vue";
import LoadingSection from "@/components/common/LoadingSection.vue";

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },

  page: {
    type: Object as PropType<Ref<number>>,
    required: true,
  },
});

const emit = defineEmits(["update:page", "update:is-loading"]);

const perPage = 10;
const bundlesStore = useBundlesStore();
const isCreateBundleModalVisible = ref(false);

onMounted(() => {
  if (bundlesStore.total === 0) {
    getBundles(props.page.value);
  }
});

function onPageChange(newPage: number) {
  emit("update:page", newPage);

  getBundles(newPage);
}

async function getBundles(page: number) {
  emit("update:is-loading", true);

  try {
    await bundlesStore.getAll({ page, perPage });
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:is-loading", false);
  }
}

const items = computed(() => bundlesStore.items);
</script>
