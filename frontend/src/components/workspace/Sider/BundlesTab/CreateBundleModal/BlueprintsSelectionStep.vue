<template>
  <div class="blueprints-step">
    <div class="selected-items">
      <n-h3 class="header">Currently selected</n-h3>

      <n-scrollbar> 113 </n-scrollbar>
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
            <n-card>
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
  ref,
  type PropType,
  onBeforeMount,
  type Ref,
  computed,
  watch,
} from "vue";
import {
  NCard,
  NGrid,
  NH3,
  NDivider,
  NSpin,
  NGridItem,
  NScrollbar,
  NPagination,
} from "naive-ui";

import { useBlueprintsStore } from "@/store/blueprints";
import type { AddBundleDto } from "@shared/types/dtos/AddBundleDto";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const page = ref(1);
const perPage = 15;
const total = ref(0);
const isLoading = ref(false);
const blueprintsStore = useBlueprintsStore();
const blueprints: Ref<IBlueprintDto[]> = ref([]);

defineProps({
  formData: {
    type: Object as PropType<AddBundleDto>,
    required: true,
  },
});

onBeforeMount(async () => {
  await fetchBlueprints();
});

async function fetchBlueprints() {
  console.log("wtf");

  isLoading.value = true;

  try {
    const data = await blueprintsStore.getAll({ page: page.value, perPage });

    total.value = data.total;

    blueprints.value = data.result;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

const pageCount = computed(() => Math.ceil(total.value / perPage));

watch(page, () => {
  fetchBlueprints();
});
</script>
