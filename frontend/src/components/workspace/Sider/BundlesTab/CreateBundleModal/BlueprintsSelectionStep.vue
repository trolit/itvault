<template>
  <div class="blueprints-step">
    <div class="selected-items">
      <n-tag :bordered="false" type="info">
        <n-icon :size="20" :component="InformationIcon" /> Currently selected
        ({{ selectedBlueprints.length }})
      </n-tag>

      <n-scrollbar>
        <n-card v-for="blueprint in selectedBlueprints" :key="blueprint.id">
          <div
            class="thumbnail"
            :style="{ backgroundColor: blueprint.color }"
          />

          {{ blueprint.name }}

          <n-button
            quaternary
            circle
            type="error"
            @click="$emit('deselect-blueprint', blueprint)"
          >
            <template #icon>
              <n-icon :component="DeleteIcon" />
            </template>
          </n-button>
        </n-card>
      </n-scrollbar>
    </div>

    <n-divider vertical />

    <div class="items">
      <n-scrollbar trigger="none">
        <n-spin v-if="isLoading" />

        <n-grid
          v-else
          cols="2 s:3 m:3 l:3 xl:3 2xl:3"
          responsive="screen"
          :x-gap="25"
          :y-gap="35"
        >
          <n-grid-item v-for="blueprint in blueprints" :key="blueprint.id">
            <n-card
              @click="$emit('select-blueprint', blueprint)"
              :class="{
                selected: isBlueprintSelected(blueprint.id),
              }"
            >
              {{ blueprint.name }}

              <div
                class="thumbnail"
                :style="{ backgroundColor: blueprint.color }"
              />
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-scrollbar>

      <n-pagination v-model:page="page" :page-count="pageCount" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Delete as DeleteIcon,
  Information as InformationIcon,
} from "@vicons/carbon";
import {
  ref,
  watch,
  type Ref,
  computed,
  onBeforeMount,
  type PropType,
} from "vue";
import {
  NTag,
  NCard,
  NGrid,
  NIcon,
  NSpin,
  NButton,
  NDivider,
  NGridItem,
  NScrollbar,
  NPagination,
} from "naive-ui";

import { useBlueprintsStore } from "@/store/blueprints";
import type { BundleModalItem } from "@/types/BundleModalItem";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const props = defineProps({
  items: {
    type: Object as PropType<BundleModalItem[]>,
    required: true,
  },

  selectedBlueprints: {
    type: Object as PropType<IBlueprintDto[]>,
    required: true,
  },
});

defineEmits(["select-blueprint", "deselect-blueprint"]);

const page = ref(1);
const perPage = 15;
const total = ref(0);
const isLoading = ref(false);
const blueprintsStore = useBlueprintsStore();
const blueprints: Ref<IBlueprintDto[]> = ref([]);

onBeforeMount(async () => {
  await fetchBlueprints();
});

const pageCount = computed(() => Math.ceil(total.value / perPage));

watch(page, () => {
  fetchBlueprints();
});

function isBlueprintSelected(id: number) {
  return props.selectedBlueprints.some(
    selectedBlueprint => selectedBlueprint.id === id
  );
}

async function fetchBlueprints() {
  isLoading.value = true;

  try {
    const data = await blueprintsStore.getAll({
      page: page.value,
      perPage,
      inUse: 1,
    });

    total.value = data.total;

    blueprints.value = data.result;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
