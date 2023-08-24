<template>
  <div class="blueprints-tab">
    <div class="header">
      <n-button type="warning" size="small">
        <n-icon :component="ResetIcon" :size="20" />
      </n-button>

      <!-- @TODO create common component -->
      <n-input clearable show-count placeholder="Type name or color">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <n-button size="small" @click="toggleAddEditBlueprintDrawer">
        <n-icon :component="AddIcon" :size="25" />
      </n-button>
    </div>

    <n-scrollbar>
      <n-list v-if="!isLoading" clickable hoverable>
        <n-list-item
          v-for="(blueprint, index) in blueprintsStore.items"
          :key="index"
          @click="toggleAddEditBlueprintDrawer"
        >
          <div class="wrapper">
            <div class="content">
              <div
                class="thumbnail"
                :style="{ backgroundColor: blueprint.color }"
              />

              <n-tag size="tiny">{{ blueprint.color }}</n-tag>
            </div>

            <small>{{ blueprint.name }}</small>
          </div>
        </n-list-item>
      </n-list>

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>

    <div class="footer">
      <n-pagination
        :page="page"
        size="small"
        :item-count="blueprintsStore.total"
        :page-size="perPage"
        :page-slot="6"
        @update:page="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Add as AddIcon,
  Reset as ResetIcon,
  Search as SearchIcon,
} from "@vicons/carbon";
import {
  NTag,
  NSpin,
  NList,
  NIcon,
  NInput,
  NButton,
  NListItem,
  NScrollbar,
  NPagination,
} from "naive-ui";
import { onMounted, ref } from "vue";

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useBlueprintsStore } from "@/store/blueprints";

const page = ref(1);
const perPage = 11;
const isLoading = ref(false);

const drawerStore = useDrawerStore();
const blueprintsStore = useBlueprintsStore();

onMounted(() => {
  if (blueprintsStore.total === 0) {
    getBlueprints();
  }
});

function toggleAddEditBlueprintDrawer() {
  drawerStore.setActiveDrawer(Drawer.AddEditBlueprint);
}

function onPageChange(newPage: number) {
  page.value = newPage;

  getBlueprints();
}

// @TODO handle infinite scroll
async function getBlueprints() {
  isLoading.value = true;

  try {
    await blueprintsStore.getAll({ page: page.value, perPage });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
