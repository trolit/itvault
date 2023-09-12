<template>
  <div class="blueprints-tab">
    <toolbar
      input-placeholder="Type name or color"
      @add-item="toggleAddEditBlueprintDrawer"
    />

    <n-scrollbar>
      <n-list v-if="!isLoading" clickable hoverable>
        <n-list-item
          v-for="(blueprint, index) in blueprintsStore.items"
          :key="index"
          @click="toggleAddEditBlueprintDrawer(blueprint)"
        >
          <n-space align="center" :wrap="false" size="large">
            <div class="color">
              <div
                class="thumbnail"
                :style="{
                  backgroundColor: blueprint.color,
                }"
              />

              <n-tag size="tiny">{{ blueprint.color }}</n-tag>
            </div>

            <n-space vertical size="small">
              {{ blueprint.name }}

              <small>
                <n-text depth="3">
                  <n-ellipsis :line-clamp="1">
                    {{ blueprint.description }}
                  </n-ellipsis>
                </n-text>
              </small>
            </n-space>
          </n-space>
        </n-list-item>
      </n-list>

      <div v-else class="spinner">
        <n-spin />
      </div>
    </n-scrollbar>

    <div class="footer">
      <n-pagination
        size="small"
        :page-slot="6"
        :page="page.value"
        :page-size="perPage"
        :item-count="blueprintsStore.total"
        @update:page="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import cloneDeep from "lodash/cloneDeep";
import {
  NTag,
  NSpin,
  NList,
  NText,
  NSpace,
  NEllipsis,
  NListItem,
  NScrollbar,
  NPagination,
} from "naive-ui";
import { onMounted, ref, type PropType, type Ref } from "vue";

import Toolbar from "./Toolbar.vue";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useBlueprintsStore } from "@/store/blueprints";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const drawerStore = useDrawerStore();
const blueprintsStore = useBlueprintsStore();

const perPage = 11;
const isLoading = ref(false);

const props = defineProps({
  page: {
    type: Object as PropType<Ref<number>>,
    required: true,
  },
});

const emit = defineEmits(["update:page"]);

onMounted(() => {
  if (blueprintsStore.total === 0) {
    getBlueprints(props.page.value);
  }
});

function toggleAddEditBlueprintDrawer(newItemToEdit?: IBlueprintDto) {
  const isSameItemToEdit = !!(
    blueprintsStore.itemToEdit?.id === newItemToEdit?.id
  );

  blueprintsStore.itemToEdit = newItemToEdit ? cloneDeep(newItemToEdit) : null;

  if (
    !isSameItemToEdit &&
    drawerStore.isDrawerActive(Drawer.AddEditBlueprint)
  ) {
    return;
  }

  drawerStore.setActiveDrawer(Drawer.AddEditBlueprint);
}

function onPageChange(newPage: number) {
  emit("update:page", newPage);

  getBlueprints(newPage);
}

async function getBlueprints(page: number) {
  isLoading.value = true;

  try {
    await blueprintsStore.getAll({ page, perPage });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
