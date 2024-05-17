<template>
  <div class="blueprints-tab">
    <toolbar
      :is-loading="isLoading"
      input-placeholder="Type name or color"
      @add-item="toggleAddEditBlueprintDrawer"
      @reload="getBlueprints(page.value)"
    />

    <n-scrollbar>
      <n-list v-if="!isLoading" clickable hoverable>
        <n-list-item
          v-for="(blueprint, index) in sortedItems"
          :key="index"
          @click="toggleAddEditBlueprintDrawer(blueprint)"
        >
          <div class="wrapper">
            <div class="color">
              <div
                class="thumbnail"
                :style="{
                  backgroundColor: blueprint.color,
                }"
              />

              <n-tag size="tiny">{{ blueprint.color }}</n-tag>
            </div>

            <div class="details">
              <n-space justify="space-between">
                {{ blueprint.name }}

                <pin-manager
                  :pinned-at="blueprint.pinnedAt"
                  :is-loading="
                    blueprintsStore.pinStatusUpdateItemId === blueprint.id
                  "
                  @pin="blueprintsStore.pin(blueprint.id)"
                  @unpin="blueprintsStore.unpin(blueprint.id)"
                />
              </n-space>

              <small>
                <n-text depth="3" :style="{ whiteSpace: 'pre-wrap' }">
                  <n-ellipsis :line-clamp="2" :tooltip="false">
                    {{ blueprint.description }}
                  </n-ellipsis>
                </n-text>
              </small>
            </div>
          </div>
        </n-list-item>
      </n-list>

      <loading-section v-else />
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
  NList,
  NText,
  NSpace,
  NEllipsis,
  NListItem,
  NScrollbar,
  NPagination,
} from "naive-ui";
import { onMounted, type PropType, type Ref } from "vue";

import Toolbar from "./Toolbar.vue";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useBlueprintsStore } from "@/store/blueprints";
import { defineComputed } from "@/helpers/defineComputed";
import PinManager from "@/components/common/PinManager.vue";
import type { IBlueprintDTO } from "@shared/types/DTOs/Blueprint";
import LoadingSection from "@/components/common/LoadingSection.vue";
import { sortArrayByPinnedAt } from "@/helpers/sortArrayByPinnedAt";

const drawerStore = useDrawerStore();
const blueprintsStore = useBlueprintsStore();

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

const { sortedItems } = defineComputed({
  sortedItems() {
    return sortArrayByPinnedAt(blueprintsStore.items);
  },
});

const perPage = 11;

onMounted(() => {
  if (blueprintsStore.total === 0) {
    getBlueprints(props.page.value);
  }
});

function toggleAddEditBlueprintDrawer(newItemToEdit?: IBlueprintDTO) {
  const isSameItemToEdit = blueprintsStore.itemToEdit?.id === newItemToEdit?.id;

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
  emit("update:is-loading", true);

  try {
    await blueprintsStore.getAll({ page, perPage });
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:is-loading", false);
  }
}
</script>
