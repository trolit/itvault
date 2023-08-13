<template>
  <div class="blueprints-tab">
    <div class="header">
      <n-button type="info" size="small" dashed>
        <n-icon :component="ResetIcon" :size="20" />
      </n-button>

      <!-- @TODO create common component -->
      <n-input clearable show-count placeholder="Type name or color">
        <template #prefix>
          <n-icon :component="SearchIcon" />
        </template>
      </n-input>

      <n-button
        type="info"
        size="small"
        dashed
        @click="toggleAddEditBlueprintDrawer"
      >
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

    <div v-if="!isLoading" class="footer">
      <n-icon :component="InformationIcon" size="16" />

      <small>
        {{ statusText }}
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Add as AddIcon,
  Reset as ResetIcon,
  Search as SearchIcon,
  Information as InformationIcon,
} from "@vicons/carbon";
import {
  NSpin,
  NList,
  NIcon,
  NInput,
  NButton,
  NListItem,
  NScrollbar,
  NTag,
} from "naive-ui";
import { onMounted, ref, computed } from "vue";

import { Drawer } from "@/types/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useBlueprintsStore } from "@/store/blueprints";

const page = ref(1);
const isLoading = ref(false);

const drawerStore = useDrawerStore();
const blueprintsStore = useBlueprintsStore();

onMounted(() => {
  if (blueprintsStore.total === 0) {
    getBlueprints();
  }
});

const statusText = computed((): string => {
  return `Loaded ${blueprintsStore.items.length} out of ${blueprintsStore.total}`;
});

function toggleAddEditBlueprintDrawer() {
  drawerStore.setActiveDrawer(Drawer.AddEditBlueprint);
}

// @TODO handle infinite scroll
async function getBlueprints() {
  isLoading.value = true;

  try {
    await blueprintsStore.getAll({ page: page.value });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
