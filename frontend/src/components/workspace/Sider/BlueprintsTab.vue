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
              <n-space justify="space-between">
                {{ blueprint.name }}

                <pin-manager
                  :pinned-at="blueprint.pinnedAt"
                  :is-loading="pinStatusUpdateItemId === blueprint.id"
                  @pin="pinItem(blueprint.id)"
                  @unpin="unpinItem(blueprint.id)"
                />
              </n-space>

              <small>
                <n-text depth="3" :style="{ whiteSpace: 'pre-wrap' }">
                  <n-ellipsis :line-clamp="2">
                    {{ blueprint.description }}
                  </n-ellipsis>
                </n-text>
              </small>
            </n-space>
          </n-space>
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
import { onMounted, ref, type PropType, type Ref } from "vue";

import Toolbar from "./Toolbar.vue";
import { Drawer } from "@/types/enums/Drawer";
import { useDrawerStore } from "@/store/drawer";
import { useGeneralStore } from "@/store/general";
import { useBlueprintsStore } from "@/store/blueprints";
import PinManager from "@/components/common/PinManager.vue";
import LoadingSection from "@/components/common/LoadingSection.vue";
import type { IBlueprintDto } from "@shared/types/dtos/IBlueprintDto";

const drawerStore = useDrawerStore();
const generalStore = useGeneralStore();
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

const perPage = 11;
const pinStatusUpdateItemId = ref(0);

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
  emit("update:is-loading", true);

  try {
    await blueprintsStore.getAll({ page, perPage });
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:is-loading", false);
  }
}

async function pinItem(id: number) {
  pinStatusUpdateItemId.value = id;

  try {
    await blueprintsStore.pin(id);
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.success(`Failed to pin blueprint!`);
  } finally {
    pinStatusUpdateItemId.value = 0;
  }
}

async function unpinItem(id: number) {
  pinStatusUpdateItemId.value = id;

  try {
    await blueprintsStore.unpin(id);
  } catch (error) {
    console.log(error);

    generalStore.messageProvider.success(`Failed to unpin blueprint!`);
  } finally {
    pinStatusUpdateItemId.value = 0;
  }
}
</script>
